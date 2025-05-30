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
  familyId: text("family_id").notNull(), // Links medicine to family
  addedBy: text("added_by"), // Track who added the medicine
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Schema for inserting and validating medicine data
export const insertMedicineSchema = createInsertSchema(medicines, {
  name: (schema) => schema.min(2, "Medicine name must be at least 2 characters"),
  potency: (schema) => schema.min(1, "Potency is required"),
  company: (schema) => schema.min(1, "Company is required"),
  location: (schema) => schema.min(1, "Location is required"),
  quantity: (schema) => schema.min(0, "Quantity cannot be negative"),
  familyId: (schema) => schema.min(1, "Family ID is required"),
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

// Homeopathic Remedies Learning System Tables
export const remedies = pgTable("remedies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  keyUses: text("key_uses").array().notNull().default([]),
  symptoms: text("symptoms").array().notNull().default([]),
  mentalSymptoms: text("mental_symptoms").array().notNull().default([]),
  physicalSymptoms: text("physical_symptoms").array().notNull().default([]),
  modalitiesWorse: text("modalities_worse").array().notNull().default([]),
  modalitiesBetter: text("modalities_better").array().notNull().default([]),
  potencies: text("potencies").array().notNull().default([]),
  dosage: text("dosage").notNull(),
  source: text("source").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const learningQuestions = pgTable("learning_questions", {
  id: serial("id").primaryKey(),
  remedyId: integer("remedy_id").references(() => remedies.id).notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  difficulty: text("difficulty").notNull().default("beginner"), // beginner, intermediate, advanced
  category: text("category").notNull().default("general"), // symptoms, uses, modalities, potency
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Will connect to user system when available
  remedyId: integer("remedy_id").references(() => remedies.id).notNull(),
  completed: boolean("completed").default(false),
  score: integer("score").default(0),
  totalQuestions: integer("total_questions").default(0),
  correctAnswers: integer("correct_answers").default(0),
  currentLevel: text("current_level").notNull().default("beginner"),
  streak: integer("streak").default(0),
  lastStudied: timestamp("last_studied").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Define relations for the learning system
export const remediesRelations = relations(remedies, ({ many }) => ({
  questions: many(learningQuestions),
  userProgress: many(userProgress)
}));

export const learningQuestionsRelations = relations(learningQuestions, ({ one }) => ({
  remedy: one(remedies, { fields: [learningQuestions.remedyId], references: [remedies.id] })
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  remedy: one(remedies, { fields: [userProgress.remedyId], references: [remedies.id] })
}));

// Schemas for validation
export const insertRemedySchema = createInsertSchema(remedies, {
  name: (schema) => schema.min(1, "Name is required"),
  fullName: (schema) => schema.min(1, "Full name is required"),
  category: (schema) => schema.min(1, "Category is required"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters")
});

export const selectRemedySchema = createSelectSchema(remedies);
export type InsertRemedy = z.infer<typeof insertRemedySchema>;
export type Remedy = z.infer<typeof selectRemedySchema>;

export const insertLearningQuestionSchema = createInsertSchema(learningQuestions, {
  question: (schema) => schema.min(5, "Question must be at least 5 characters"),
  options: (schema) => schema.min(2, "At least 2 options required"),
  explanation: (schema) => schema.min(5, "Explanation must be at least 5 characters")
});

export const selectLearningQuestionSchema = createSelectSchema(learningQuestions);
export type InsertLearningQuestion = z.infer<typeof insertLearningQuestionSchema>;
export type LearningQuestion = z.infer<typeof selectLearningQuestionSchema>;

export const insertUserProgressSchema = createInsertSchema(userProgress);
export const selectUserProgressSchema = createSelectSchema(userProgress);
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = z.infer<typeof selectUserProgressSchema>;
