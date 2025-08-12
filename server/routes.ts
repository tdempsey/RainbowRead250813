import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { rssService } from "./services/rss-parser";
import { newsApiService } from "./services/news-api";
import { scheduler } from "./services/scheduler";
import { searchParamsSchema, insertBookmarkSchema } from "@shared/schema";
import { loadDummyData } from "./dummy-data";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the content aggregation scheduler
  scheduler.start();

  // Get articles with filtering and search
  app.get("/api/articles", async (req, res) => {
    try {
      const params = searchParamsSchema.parse({
        query: req.query.query,
        category: req.query.category,
        tags: req.query.tags ? JSON.parse(req.query.tags as string) : undefined,
        source: req.query.source,
        lgbtqFocused: req.query.lgbtqFocused ? req.query.lgbtqFocused === 'true' : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      });

      let articles;
      if (params.query) {
        articles = await storage.searchArticles(params.query, params);
      } else {
        articles = await storage.getArticles(params);
      }

      res.json(articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  // Get single article
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Like an article
  app.post("/api/articles/:id/like", async (req, res) => {
    try {
      const article = await storage.likeArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error('Error liking article:', error);
      res.status(500).json({ message: "Failed to like article" });
    }
  });

  // Get RSS sources
  app.get("/api/sources", async (req, res) => {
    try {
      const sources = await storage.getRssSources();
      res.json(sources);
    } catch (error) {
      console.error('Error fetching sources:', error);
      res.status(500).json({ message: "Failed to fetch sources" });
    }
  });

  // Get categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get bookmarks for session
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID required" });
      }
      
      const bookmarks = await storage.getBookmarksBySession(sessionId);
      res.json(bookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  // Create bookmark
  app.post("/api/bookmarks", async (req, res) => {
    try {
      const bookmarkData = insertBookmarkSchema.parse(req.body);
      const bookmark = await storage.createBookmark(bookmarkData);
      res.status(201).json(bookmark);
    } catch (error) {
      console.error('Error creating bookmark:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bookmark data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  // Delete bookmark
  app.delete("/api/bookmarks/:articleId", async (req, res) => {
    try {
      const { articleId } = req.params;
      const sessionId = req.query.sessionId as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID required" });
      }
      
      const deleted = await storage.deleteBookmark(articleId, sessionId);
      if (!deleted) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  // Manual content refresh endpoint
  app.post("/api/refresh", async (req, res) => {
    try {
      console.log('Manual content refresh triggered');
      
      // Trigger RSS fetch
      rssService.fetchAllSources().catch(error => 
        console.error('RSS fetch error during manual refresh:', error)
      );
      
      // Trigger NewsAPI fetch
      newsApiService.fetchAndSave().catch(error => 
        console.error('NewsAPI fetch error during manual refresh:', error)
      );
      
      res.json({ message: "Content refresh triggered" });
    } catch (error) {
      console.error('Error triggering refresh:', error);
      res.status(500).json({ message: "Failed to trigger refresh" });
    }
  });

  // Get trending tags
  app.get("/api/trending-tags", async (req, res) => {
    try {
      const articles = await storage.getArticles({ limit: 100, offset: 0 });
      const tagCounts = new Map<string, number>();
      
      articles.forEach(article => {
        article.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });
      
      const trending = Array.from(tagCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));
      
      res.json(trending);
    } catch (error) {
      console.error('Error fetching trending tags:', error);
      res.status(500).json({ message: "Failed to fetch trending tags" });
    }
  });

  // Load dummy data endpoint
  app.post("/api/load-dummy-data", async (req, res) => {
    try {
      await loadDummyData();
      res.json({ message: "Dummy data loaded successfully" });
    } catch (error) {
      console.error('Error loading dummy data:', error);
      res.status(500).json({ message: "Failed to load dummy data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
