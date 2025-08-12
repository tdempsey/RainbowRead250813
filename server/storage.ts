import { type Article, type InsertArticle, type RssSource, type InsertRssSource, type Bookmark, type InsertBookmark, type Category, type InsertCategory, type SearchParams } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Articles
  getArticles(params?: SearchParams): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  searchArticles(query: string, params?: SearchParams): Promise<Article[]>;
  likeArticle(id: string): Promise<Article | undefined>;
  
  // RSS Sources
  getRssSources(): Promise<RssSource[]>;
  getActiveRssSources(): Promise<RssSource[]>;
  createRssSource(source: InsertRssSource): Promise<RssSource>;
  updateRssSource(id: string, updates: Partial<InsertRssSource>): Promise<RssSource | undefined>;
  deleteRssSource(id: string): Promise<boolean>;
  
  // Bookmarks
  getBookmarksBySession(sessionId: string): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(articleId: string, sessionId: string): Promise<boolean>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class MemStorage implements IStorage {
  private articles: Map<string, Article> = new Map();
  private rssSources: Map<string, RssSource> = new Map();
  private bookmarks: Map<string, Bookmark> = new Map();
  private categories: Map<string, Category> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default categories
    const defaultCategories = [
      { name: "All Stories", slug: "all", description: "All news stories", isActive: true },
      { name: "Politics", slug: "politics", description: "Political news and updates", isActive: true },
      { name: "Culture & Arts", slug: "culture", description: "Cultural events and artistic expression", isActive: true },
      { name: "Health & Wellness", slug: "health", description: "Health and wellness information", isActive: true },
      { name: "Business", slug: "business", description: "Business and economic news", isActive: true },
      { name: "Community", slug: "community", description: "Community events and stories", isActive: true },
    ];

    defaultCategories.forEach(cat => {
      const id = randomUUID();
      this.categories.set(id, { ...cat, id });
    });

    // Initialize default RSS sources
    const defaultSources = [
      { name: "GLAAD Media", url: "https://glaad.org/feed/", category: "advocacy", isActive: true, isLgbtqFocused: true },
      { name: "Out Magazine", url: "https://www.out.com/rss.xml", category: "culture", isActive: true, isLgbtqFocused: true },
      { name: "Queerty", url: "https://www.queerty.com/feed", category: "news", isActive: true, isLgbtqFocused: true },
      { name: "The Advocate", url: "https://www.advocate.com/rss.xml", category: "news", isActive: true, isLgbtqFocused: true },
    ];

    defaultSources.forEach(source => {
      const id = randomUUID();
      this.rssSources.set(id, { ...source, id, lastFetched: null });
    });
  }

  private createSearchVector(article: Article): string {
    return `${article.title} ${article.excerpt} ${article.content} ${article.tags.join(' ')} ${article.author} ${article.category}`.toLowerCase();
  }

  async getArticles(params?: SearchParams): Promise<Article[]> {
    console.log(`Getting articles: total in storage = ${this.articles.size}, params =`, params);
    let articles = Array.from(this.articles.values());

    if (params) {
      if (params.category && params.category !== 'all') {
        articles = articles.filter(a => a.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params.tags && params.tags.length > 0) {
        articles = articles.filter(a => params.tags!.some(tag => a.tags.includes(tag)));
      }
      if (params.source) {
        articles = articles.filter(a => a.source.toLowerCase().includes(params.source!.toLowerCase()));
      }
      if (params.lgbtqFocused !== undefined) {
        articles = articles.filter(a => a.isLgbtqFocused === params.lgbtqFocused);
      }
    }

    // Sort by publishedAt desc
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const offset = params?.offset || 0;
    const limit = params?.limit || 20;
    return articles.slice(offset, offset + limit);
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(articleData: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = {
      ...articleData,
      tags: articleData.tags || [],
      id,
      createdAt: new Date(),
      likes: 0,
      searchVector: '',
    };
    
    article.searchVector = this.createSearchVector(article);
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;

    const updatedArticle = { ...article, ...updates };
    updatedArticle.searchVector = this.createSearchVector(updatedArticle);
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async searchArticles(query: string, params?: SearchParams): Promise<Article[]> {
    const searchTerms = query.toLowerCase().split(' ');
    let articles = Array.from(this.articles.values());

    // Filter by search terms
    articles = articles.filter(article => {
      const searchVector = article.searchVector || this.createSearchVector(article);
      return searchTerms.every(term => searchVector.includes(term));
    });

    // Apply additional filters
    if (params) {
      if (params.category && params.category !== 'all') {
        articles = articles.filter(a => a.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params.tags && params.tags.length > 0) {
        articles = articles.filter(a => params.tags!.some(tag => a.tags.includes(tag)));
      }
      if (params.lgbtqFocused !== undefined) {
        articles = articles.filter(a => a.isLgbtqFocused === params.lgbtqFocused);
      }
    }

    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    const offset = params?.offset || 0;
    const limit = params?.limit || 20;
    return articles.slice(offset, offset + limit);
  }

  async likeArticle(id: string): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;

    article.likes += 1;
    this.articles.set(id, article);
    return article;
  }

  async getRssSources(): Promise<RssSource[]> {
    return Array.from(this.rssSources.values());
  }

  async getActiveRssSources(): Promise<RssSource[]> {
    return Array.from(this.rssSources.values()).filter(source => source.isActive);
  }

  async createRssSource(sourceData: InsertRssSource): Promise<RssSource> {
    const id = randomUUID();
    const source: RssSource = {
      ...sourceData,
      isActive: sourceData.isActive ?? true,
      isLgbtqFocused: sourceData.isLgbtqFocused ?? false,
      id,
      lastFetched: null,
    };
    this.rssSources.set(id, source);
    return source;
  }

  async updateRssSource(id: string, updates: Partial<InsertRssSource>): Promise<RssSource | undefined> {
    const source = this.rssSources.get(id);
    if (!source) return undefined;

    const updatedSource = { ...source, ...updates };
    this.rssSources.set(id, updatedSource);
    return updatedSource;
  }

  async deleteRssSource(id: string): Promise<boolean> {
    return this.rssSources.delete(id);
  }

  async getBookmarksBySession(sessionId: string): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(b => b.sessionId === sessionId);
  }

  async createBookmark(bookmarkData: InsertBookmark): Promise<Bookmark> {
    const id = randomUUID();
    const bookmark: Bookmark = {
      ...bookmarkData,
      id,
      createdAt: new Date(),
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(articleId: string, sessionId: string): Promise<boolean> {
    const bookmark = Array.from(this.bookmarks.values())
      .find(b => b.articleId === articleId && b.sessionId === sessionId);
    
    if (bookmark) {
      return this.bookmarks.delete(bookmark.id);
    }
    return false;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(cat => cat.isActive);
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...categoryData,
      isActive: categoryData.isActive ?? true,
      description: categoryData.description ?? null,
      id,
    };
    this.categories.set(id, category);
    return category;
  }
}

export const storage = new MemStorage();
