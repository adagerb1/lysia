import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const leadSubmissions = sqliteTable("lead_submissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  city: text("city").notNull(),
  contact: text("contact").notNull(),
  concern: text("concern").notNull(),
  planInterest: text("plan_interest").notNull().default("Por definir"),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  attributionJson: text("attribution_json").notNull().default("{}"),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const conversionEvents = sqliteTable("conversion_events", {
  id: text("id").primaryKey(),
  eventName: text("event_name").notNull(),
  sessionId: text("session_id").notNull(),
  ctaId: text("cta_id"),
  ctaLocation: text("cta_location"),
  variantId: text("variant_id").notNull().default("control_v000"),
  metadataJson: text("metadata_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
