import { pgTable, serial, text, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scansTable = pgTable("scans", {
  id: serial("id").primaryKey(),
  foodName: text("food_name").notNull(),
  confidence: real("confidence").notNull(),
  servingSize: text("serving_size").notNull(),
  calories: real("calories").notNull(),
  protein: text("protein").notNull(),
  carbs: text("carbs").notNull(),
  fat: text("fat").notNull(),
  fiber: text("fiber").notNull(),
  sugar: text("sugar").notNull(),
  sodium: text("sodium").notNull(),
  cholesterol: text("cholesterol").notNull(),
  healthScore: real("health_score").notNull(),
  healthSummary: text("health_summary").notNull(),
  vitamins: jsonb("vitamins").notNull().$type<Array<{ name: string; amount: string; dailyPct: number }>>(),
  minerals: jsonb("minerals").notNull().$type<Array<{ name: string; amount: string }>>(),
  allergens: jsonb("allergens").notNull().$type<string[]>(),
  dietaryFlags: jsonb("dietary_flags").notNull().$type<string[]>(),
  ingredients: jsonb("ingredients").notNull().$type<string[]>(),
  recommendations: jsonb("recommendations").notNull().$type<Array<{ emoji: string; text: string; type: "positive" | "warning" | "tip" }>>(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScanSchema = createInsertSchema(scansTable).omit({ id: true, createdAt: true });
export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scansTable.$inferSelect;
