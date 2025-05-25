-- HomeoInvent Enhanced Database Schema
-- Generated: 2025-05-25
-- Version: 2.0 Enhanced

-- Enhanced Wisdom System (200+ quotes integrated in component)
-- Location: client/src/components/life-wisdom.tsx
-- Features: Auto-rotation, authentic sources, multiple categories

-- Enhanced Learning System (150+ remedies)
-- Remedies table structure for learning system
CREATE TABLE IF NOT EXISTS enhanced_remedies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  primary_uses TEXT[] NOT NULL,
  key_symptoms TEXT[] NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'beginner',
  potencies TEXT[] NOT NULL,
  dosage TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Learning questions for quiz system
CREATE TABLE IF NOT EXISTS enhanced_learning_questions (
  id SERIAL PRIMARY KEY,
  remedy_id INTEGER REFERENCES enhanced_remedies(id),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'beginner',
  category VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_enhanced_remedies_name ON enhanced_remedies(name);
CREATE INDEX IF NOT EXISTS idx_enhanced_remedies_difficulty ON enhanced_remedies(difficulty);
CREATE INDEX IF NOT EXISTS idx_enhanced_questions_remedy ON enhanced_learning_questions(remedy_id);

-- Your existing tables (medicines, users, etc.) remain unchanged
-- The enhanced system works alongside your current database structure

-- Data Population Notes:
-- 1. Wisdom quotes are embedded in the React component (life-wisdom.tsx)
-- 2. Learning remedies data is in enhanced-learning-database.ts
-- 3. Import functions available for programmatic access
-- 4. All enhancements are already active in your current app

-- Backup and Restoration:
-- Use the provided JSON files to restore data in new installations
-- Follow the setup guide for complete integration instructions
