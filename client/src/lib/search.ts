import Fuse from 'fuse.js';
import type { Article } from '@shared/schema';

export interface SearchOptions {
  threshold?: number;
  includeScore?: boolean;
  keys?: string[];
}

export class ArticleSearchService {
  private fuse: Fuse<Article> | null = null;
  private articles: Article[] = [];

  constructor(articles: Article[] = [], options: SearchOptions = {}) {
    this.updateArticles(articles, options);
  }

  updateArticles(articles: Article[], options: SearchOptions = {}) {
    this.articles = articles;
    
    const fuseOptions = {
      threshold: options.threshold || 0.3, // Lower = more strict matching
      includeScore: options.includeScore || true,
      keys: options.keys || [
        { name: 'title', weight: 0.4 },
        { name: 'excerpt', weight: 0.3 },
        { name: 'content', weight: 0.2 },
        { name: 'tags', weight: 0.1 },
        { name: 'author', weight: 0.05 },
        { name: 'category', weight: 0.05 },
      ],
      // Advanced options for better search
      ignoreLocation: true,
      findAllMatches: true,
      minMatchCharLength: 2,
    };

    this.fuse = new Fuse(articles, fuseOptions);
  }

  search(query: string, limit?: number): Article[] {
    if (!this.fuse || !query.trim()) {
      return this.articles.slice(0, limit || this.articles.length);
    }

    const results = this.fuse.search(query);
    const articles = results.map(result => result.item);
    
    return limit ? articles.slice(0, limit) : articles;
  }

  searchWithScores(query: string, limit?: number): Array<{ article: Article; score: number }> {
    if (!this.fuse || !query.trim()) {
      return this.articles
        .slice(0, limit || this.articles.length)
        .map(article => ({ article, score: 0 }));
    }

    const results = this.fuse.search(query);
    const articlesWithScores = results.map(result => ({
      article: result.item,
      score: result.score || 0,
    }));
    
    return limit ? articlesWithScores.slice(0, limit) : articlesWithScores;
  }

  // Filter articles by category
  filterByCategory(category: string): Article[] {
    if (category === 'all' || !category) {
      return this.articles;
    }
    return this.articles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter articles by tags
  filterByTags(tags: string[]): Article[] {
    if (!tags || tags.length === 0) {
      return this.articles;
    }
    return this.articles.filter(article => 
      tags.some(tag => article.tags.includes(tag))
    );
  }

  // Filter LGBTQ+ focused articles
  filterLgbtqFocused(lgbtqOnly: boolean = true): Article[] {
    if (!lgbtqOnly) {
      return this.articles;
    }
    return this.articles.filter(article => article.isLgbtqFocused);
  }

  // Advanced search with multiple filters
  advancedSearch({
    query,
    category,
    tags,
    lgbtqFocused,
    limit,
  }: {
    query?: string;
    category?: string;
    tags?: string[];
    lgbtqFocused?: boolean;
    limit?: number;
  }): Article[] {
    let results = this.articles;

    // Apply text search first
    if (query && query.trim()) {
      results = this.search(query);
    }

    // Apply category filter
    if (category && category !== 'all') {
      results = results.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply tag filter
    if (tags && tags.length > 0) {
      results = results.filter(article => 
        tags.some(tag => article.tags.includes(tag))
      );
    }

    // Apply LGBTQ+ filter
    if (lgbtqFocused !== undefined) {
      results = results.filter(article => article.isLgbtqFocused === lgbtqFocused);
    }

    return limit ? results.slice(0, limit) : results;
  }

  // Get trending tags from current articles
  getTrendingTags(limit: number = 10): Array<{ tag: string; count: number }> {
    const tagCounts = new Map<string, number>();
    
    this.articles.forEach(article => {
      article.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Get suggested search terms based on article content
  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query.trim()) return [];

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    // Collect suggestions from titles, tags, and categories
    this.articles.forEach(article => {
      // From titles
      const titleWords = article.title.toLowerCase().split(/\s+/);
      titleWords.forEach(word => {
        if (word.length > 3 && word.startsWith(queryLower)) {
          suggestions.add(word);
        }
      });

      // From tags
      article.tags.forEach(tag => {
        if (tag.toLowerCase().startsWith(queryLower)) {
          suggestions.add(tag);
        }
      });

      // From categories
      if (article.category.toLowerCase().startsWith(queryLower)) {
        suggestions.add(article.category);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }
}

// Export a default instance for convenience
export const searchService = new ArticleSearchService();
