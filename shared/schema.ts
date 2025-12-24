import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: text("content").notNull(),
  order: integer("order").notNull(),
});

// === BASE SCHEMAS ===
export const insertChapterSchema = createInsertSchema(chapters).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;

// Response types
export type ChapterResponse = Chapter;
export type ChaptersListResponse = Chapter[];
