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
  // Load dummy data automatically on startup
  await loadDummyData();
  
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

  // Admin endpoints for RSS source management
  app.post("/api/sources", async (req, res) => {
    try {
      const sourceData = req.body;
      const source = await storage.createRssSource(sourceData);
      res.status(201).json(source);
    } catch (error) {
      console.error('Error creating RSS source:', error);
      res.status(500).json({ message: "Failed to create RSS source" });
    }
  });

  app.delete("/api/sources/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteRssSource(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "RSS source not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting RSS source:', error);
      res.status(500).json({ message: "Failed to delete RSS source" });
    }
  });

  app.post("/api/sources/:id/refresh", async (req, res) => {
    try {
      const sources = await storage.getRssSources();
      const source = sources.find(s => s.id === req.params.id);
      if (!source) {
        return res.status(404).json({ message: "RSS source not found" });
      }
      
      // Fetch articles from this specific source
      const articles = await rssService.fetchFromSource(source);
      for (const article of articles) {
        await storage.createArticle(article);
      }
      
      res.json({ message: `Fetched ${articles.length} new articles`, count: articles.length });
    } catch (error) {
      console.error('Error refreshing RSS feed:', error);
      res.status(500).json({ message: "Failed to refresh RSS feed" });
    }
  });

  // Category management endpoints
  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = req.body;
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.post("/api/categories/reorder", async (req, res) => {
    try {
      const { categoryOrders } = req.body; // Array of {id, sortOrder}
      for (const { id, sortOrder } of categoryOrders) {
        await storage.updateCategory(id, { sortOrder });
      }
      res.json({ message: "Categories reordered successfully" });
    } catch (error) {
      console.error('Error reordering categories:', error);
      res.status(500).json({ message: "Failed to reorder categories" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const updated = await storage.updateCategory(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  // Article promotion endpoints
  app.post("/api/articles/:id/promote", async (req, res) => {
    try {
      const { rankScore } = req.body;
      const article = await storage.promoteArticle(req.params.id, rankScore);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error('Error promoting article:', error);
      res.status(500).json({ message: "Failed to promote article" });
    }
  });

  app.delete("/api/articles/:id/promote", async (req, res) => {
    try {
      const article = await storage.unpromoteArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error('Error unpromoting article:', error);
      res.status(500).json({ message: "Failed to unpromote article" });
    }
  });

  // Article hiding endpoints
  app.post("/api/articles/:id/hide", async (req, res) => {
    try {
      const article = await storage.hideArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error('Error hiding article:', error);
      res.status(500).json({ message: "Failed to hide article" });
    }
  });

  app.delete("/api/articles/:id/hide", async (req, res) => {
    try {
      const article = await storage.unhideArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error('Error unhiding article:', error);
      res.status(500).json({ message: "Failed to unhide article" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const success = await storage.deleteArticle(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
