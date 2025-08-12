import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  url: text("url").notNull().unique(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default([]),
  author: text("author").notNull(),
  source: text("source").notNull(),
  sourceType: text("source_type").notNull(), // 'rss' | 'newsapi'
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  likes: integer("likes").notNull().default(0),
  isLgbtqFocused: boolean("is_lgbtq_focused").notNull().default(false),
  isPromoted: boolean("is_promoted").notNull().default(false),
  rankScore: integer("rank_score").notNull().default(0),
  promotedAt: timestamp("promoted_at"),
  searchVector: text("search_vector"), // For full-text search indexing
});

export const rssSources = pgTable("rss_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  category: text("category").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastFetched: timestamp("last_fetched"),
  isLgbtqFocused: boolean("is_lgbtq_focused").notNull().default(false),
});

export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: varchar("article_id").notNull(),
  sessionId: text("session_id").notNull(), // Using session-based bookmarking
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Insert schemas
export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  likes: true,
  isPromoted: true,
  rankScore: true,
  promotedAt: true,
  searchVector: true,
});

export const insertRssSourceSchema = createInsertSchema(rssSources).omit({
  id: true,
  lastFetched: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Types
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type RssSource = typeof rssSources.$inferSelect;
export type InsertRssSource = z.infer<typeof insertRssSourceSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Search and filter types
export const searchParamsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source: z.string().optional(),
  lgbtqFocused: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
