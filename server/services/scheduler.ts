import { rssService } from './rss-parser';
import { newsApiService } from './news-api';

export class SchedulerService {
  private intervals: NodeJS.Timeout[] = [];

  start(): void {
    console.log('Starting content aggregation scheduler...');

    // Fetch RSS feeds every 30 minutes
    const rssInterval = setInterval(async () => {
      console.log('Scheduled RSS fetch starting...');
      await rssService.fetchAllSources();
    }, 30 * 60 * 1000); // 30 minutes

    // Fetch NewsAPI every 2 hours (to respect rate limits)
    const newsApiInterval = setInterval(async () => {
      console.log('Scheduled NewsAPI fetch starting...');
      await newsApiService.fetchAndSave();
    }, 2 * 60 * 60 * 1000); // 2 hours

    this.intervals.push(rssInterval, newsApiInterval);

    // Initial fetch on startup
    setTimeout(async () => {
      console.log('Initial content fetch starting...');
      await rssService.fetchAllSources();
      await newsApiService.fetchAndSave();
    }, 5000); // Wait 5 seconds after startup
  }

  stop(): void {
    console.log('Stopping scheduler...');
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }
}

export const scheduler = new SchedulerService();
