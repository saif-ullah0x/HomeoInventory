import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Medicines table for homeopathic medicine inventory
export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  potency: text("potency").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  subLocation: text("sub_location"),
  quantity: integer("quantity").notNull().default(0),
  bottleSize: text("bottle_size"),
});

// Schema for inserting and validating medicine data
export const insertMedicineSchema = createInsertSchema(medicines, {
  name: (schema) => schema.min(2, "Medicine name must be at least 2 characters"),
  potency: (schema) => schema.min(1, "Potency is required"),
  company: (schema) => schema.min(1, "Company is required"),
  location: (schema) => schema.min(1, "Location is required"),
  quantity: (schema) => schema.min(0, "Quantity cannot be negative"),
});

export const selectMedicineSchema = createSelectSchema(medicines);

// Export types for use in the application
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type Medicine = z.infer<typeof selectMedicineSchema>;

// Original users table for authentication (keeping it for compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Shared inventory table for cloud-based family sharing
export const sharedInventories = pgTable("shared_inventories", {
  id: serial("id").primaryKey(),
  inventory_id: text("inventory_id").notNull().unique(),
  inventory_data: jsonb("inventory_data").notNull(), // Store medicine list as JSON
  owner_id: text("owner_id"), // Optional owner ID
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  name: text("name"), // Optional inventory name
  is_view_only: boolean("is_view_only").default(false),
});

// Schema for inserting and validating shared inventory data
export const insertSharedInventorySchema = createInsertSchema(sharedInventories, {
  inventory_id: (schema) => schema.min(5, "Inventory ID must be at least 5 characters"),
  inventory_data: (schema) => schema.refine(data => 
    Array.isArray(data) && data.length > 0, 
    { message: "Inventory data must be a non-empty array" }
  ),
});

export const selectSharedInventorySchema = createSelectSchema(sharedInventories);

// Export types for use in the application
export type InsertSharedInventory = z.infer<typeof insertSharedInventorySchema>;
export type SharedInventory = z.infer<typeof selectSharedInventorySchema>;
