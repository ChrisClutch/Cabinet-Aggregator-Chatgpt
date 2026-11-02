import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  supplier: text("supplier").notNull(),
});
export const sessions = sqliteTable("sessions", {
  token: text("token").primaryKey(),
  user: text("user").notNull(),
  role: text("role").notNull(),
  expires: integer("expires").notNull(),
});
export const suppliers = sqliteTable("suppliers", {
  id: text("id").primaryKey(),
  data: text("data").notNull(),
  status: text("status").notNull(),
  featured: integer("featured").notNull().default(0),
});
export const quotes = sqliteTable("quotes", {
  id: text("id").primaryKey(),
  data: text("data").notNull(),
  created: text("created").notNull(),
  status: text("status").notNull().default("New"),
});
export const recipients = sqliteTable("recipients", {
  id: text("id").primaryKey(),
  quote: text("quote").notNull(),
  supplier: text("supplier").notNull(),
  status: text("status").notNull().default("Pending"),
  response: text("response"),
});
export const files = sqliteTable("files", {
  id: text("id").primaryKey(),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
});
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  data: text("data").notNull(),
});
export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  created: text("created").notNull(),
});
export const limits = sqliteTable("limits", {
  id: text("id").primaryKey(),
  count: integer("count").notNull(),
  expires: integer("expires").notNull(),
});
