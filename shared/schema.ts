import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
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
