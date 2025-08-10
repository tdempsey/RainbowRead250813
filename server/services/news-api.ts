import { storage } from '../storage';
import { type InsertArticle } from '@shared/schema';

export class NewsApiService {
  private apiKey: string;
  private baseUrl = 'https://newsapi.org/v2';

  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY || '';
    if (!this.apiKey) {
      console.warn('NEWS_API_KEY not found in environment variables');
    }
  }

  private lgbtqKeywords = [
    'LGBTQ', 'LGBT', 'gay rights', 'transgender', 'pride', 'marriage equality',
    'discrimination', 'sexual orientation', 'gender identity', 'queer', 'lesbian',
    'bisexual', 'non-binary', 'GLAAD', 'Human Rights Campaign'
  ];

  private isLgbtqFocused(title: string, description: string): boolean {
    const text = `${title} ${description}`.toLowerCase();
    return this.lgbtqKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  private categorizeArticle(title: string, description: string): string {
    const text = `${title} ${description}`.toLowerCase();
    
    if (['politics', 'government', 'election', 'congress', 'senate', 'legislation'].some(k => text.includes(k))) {
      return 'politics';
    }
    if (['culture', 'art', 'entertainment', 'music', 'film', 'movie', 'book', 'festival'].some(k => text.includes(k))) {
      return 'culture';
    }
    if (['health', 'medical', 'wellness', 'mental health', 'healthcare', 'hospital'].some(k => text.includes(k))) {
      return 'health';
    }
    if (['business', 'corporate', 'company', 'economic', 'finance', 'market', 'startup'].some(k => text.includes(k))) {
      return 'business';
    }
    if (['community', 'local', 'neighborhood', 'volunteer', 'charity', 'nonprofit'].some(k => text.includes(k))) {
      return 'community';
    }
    
    return 'news';
  }

  async fetchLgbtqNews(): Promise<InsertArticle[]> {
    if (!this.apiKey) {
      console.warn('NewsAPI key not available, skipping NewsAPI fetch');
      return [];
    }

    const articles: InsertArticle[] = [];

    try {
      // Fetch articles with LGBTQ-related keywords
      for (const keyword of this.lgbtqKeywords.slice(0, 5)) { // Limit API calls
        const response = await fetch(
          `${this.baseUrl}/everything?q="${keyword}"&language=en&sortBy=publishedAt&pageSize=20`,
          {
            headers: {
              'X-API-Key': this.apiKey,
            },
          }
        );

        if (!response.ok) {
          console.error(`NewsAPI error for keyword "${keyword}": ${response.status} ${response.statusText}`);
          continue;
        }

        const data = await response.json();
        
        if (!data.articles) continue;

        for (const item of data.articles) {
          if (!item.title || !item.url || item.title === '[Removed]') continue;

          // Check if article already exists
          const existingArticles = await storage.getArticles();
          const exists = existingArticles.some(a => a.url === item.url);
          if (exists) continue;

          const isLgbtqFocused = this.isLgbtqFocused(item.title, item.description || '');
          const category = this.categorizeArticle(item.title, item.description || '');

          const article: InsertArticle = {
            title: item.title,
            excerpt: item.description || '',
            content: item.content || item.description || '',
            url: item.url,
            imageUrl: item.urlToImage || undefined,
            category,
            tags: [keyword],
            author: item.author || item.source?.name || 'NewsAPI',
            source: item.source?.name || 'NewsAPI',
            sourceType: 'newsapi',
            publishedAt: new Date(item.publishedAt),
            isLgbtqFocused,
          };

          articles.push(article);
        }

        // Add delay between API calls to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`Fetched ${articles.length} articles from NewsAPI`);
      return articles;
    } catch (error) {
      console.error('Error fetching from NewsAPI:', error);
      return [];
    }
  }

  async saveArticles(articles: InsertArticle[]): Promise<void> {
    for (const article of articles) {
      try {
        await storage.createArticle(article);
      } catch (error) {
        console.error(`Error saving NewsAPI article: ${article.title}`, error);
      }
    }
  }

  async fetchAndSave(): Promise<void> {
    const articles = await this.fetchLgbtqNews();
    await this.saveArticles(articles);
  }
}

export const newsApiService = new NewsApiService();
