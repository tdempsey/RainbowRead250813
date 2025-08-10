import Parser from 'rss-parser';
import { storage } from '../storage';
import { type InsertArticle, type RssSource } from '@shared/schema';

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'description', 'pubDate', 'guid']
  }
});

export class RssService {
  private lgbtqKeywords = [
    'lgbtq', 'lgbt', 'gay', 'lesbian', 'bisexual', 'transgender', 'trans', 'queer',
    'pride', 'rainbow', 'marriage equality', 'discrimination', 'civil rights',
    'coming out', 'gender identity', 'sexual orientation', 'drag', 'non-binary',
    'glaad', 'human rights campaign', 'stonewall', 'pride parade', 'gay rights'
  ];

  private isLgbtqFocused(title: string, content: string, tags: string[] = []): boolean {
    const text = `${title} ${content} ${tags.join(' ')}`.toLowerCase();
    return this.lgbtqKeywords.some(keyword => text.includes(keyword));
  }

  private extractCategory(source: RssSource, tags: string[] = []): string {
    if (tags.length > 0) {
      const tag = tags[0].toLowerCase();
      if (['politics', 'political', 'government'].some(p => tag.includes(p))) return 'politics';
      if (['culture', 'art', 'entertainment', 'music', 'film'].some(c => tag.includes(c))) return 'culture';
      if (['health', 'wellness', 'medical', 'mental'].some(h => tag.includes(h))) return 'health';
      if (['business', 'economic', 'finance', 'corporate'].some(b => tag.includes(b))) return 'business';
      if (['community', 'local', 'event', 'social'].some(c => tag.includes(c))) return 'community';
    }
    return source.category || 'news';
  }

  private cleanContent(content: string): string {
    // Remove HTML tags and clean up content
    return content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()
      .substring(0, 500); // Limit excerpt length
  }

  async fetchFromSource(source: RssSource): Promise<InsertArticle[]> {
    try {
      console.log(`Fetching RSS from: ${source.name} (${source.url})`);
      const feed = await parser.parseURL(source.url);
      const articles: InsertArticle[] = [];

      if (!feed.items) {
        console.warn(`No items found in RSS feed: ${source.name}`);
        return articles;
      }

      for (const item of feed.items.slice(0, 20)) { // Limit to 20 most recent items
        if (!item.title || !item.link) continue;

        // Check if article already exists
        const existingArticles = await storage.getArticles();
        const exists = existingArticles.some(a => a.url === item.link);
        if (exists) continue;

        const content = item['content:encoded'] || item.content || item.description || '';
        const cleanContent = this.cleanContent(content);
        const excerpt = cleanContent.substring(0, 300) + (cleanContent.length > 300 ? '...' : '');
        
        const tags = item.categories || [];
        const isLgbtqFocused = source.isLgbtqFocused || this.isLgbtqFocused(item.title, content, tags);
        const category = this.extractCategory(source, tags);

        const article: InsertArticle = {
          title: item.title,
          excerpt,
          content: cleanContent,
          url: item.link,
          imageUrl: item.enclosure?.url || undefined,
          category,
          tags: tags.slice(0, 5), // Limit tags
          author: item.creator || item.author || source.name,
          source: source.name,
          sourceType: 'rss',
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          isLgbtqFocused,
        };

        articles.push(article);
      }

      // Update last fetched timestamp
      await storage.updateRssSource(source.id, { lastFetched: new Date() });
      
      console.log(`Fetched ${articles.length} new articles from ${source.name}`);
      return articles;
    } catch (error) {
      console.error(`Error fetching RSS from ${source.name}:`, error);
      return [];
    }
  }

  async fetchAllSources(): Promise<void> {
    try {
      const sources = await storage.getActiveRssSources();
      console.log(`Fetching from ${sources.length} RSS sources...`);

      for (const source of sources) {
        const articles = await this.fetchFromSource(source);
        
        for (const article of articles) {
          try {
            await storage.createArticle(article);
          } catch (error) {
            console.error(`Error saving article: ${article.title}`, error);
          }
        }
      }

      console.log('RSS fetch complete');
    } catch (error) {
      console.error('Error in fetchAllSources:', error);
    }
  }
}

export const rssService = new RssService();
