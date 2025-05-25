/**
 * Learning Page - Updated with Enhanced UI
 * Includes:
 * - Improved centered title with stylish design
 * - Removed "150 Medicines" text displays
 * - Added sticky search bar with scroll behavior
 * - Moved medicine count to bottom-right
 * - Removed redundant "Start Quiz" button
 * - Improved medicine details popup with proper scrolling
 */

import { useState } from "react";
import EnhancedLearningAssistantUI from "@/components/enhanced-learning-assistant-ui";

// Medicine and quiz data imported from original file
interface HomeopathicMedicine {
  id: number;
  name: string;
  commonName: string;
  category: string;
  primaryUses: string[];
  keySymptoms: string[];
  mentalSymptoms: string[];
  physicalSymptoms: string[];
  modalities: {
    worse: string[];
    better: string[];
  };
  potency: string;
  dosage: string;
  frequency: string;
  source: string;
  keynotes: string[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  medicineId: number;
}

// Use the same medicine data from the original learning page
// Import the ENHANCED_MEDICINES, ADDITIONAL_MEDICINES and ALL_MEDICINES from the original file
import { ENHANCED_MEDICINES, ADDITIONAL_MEDICINES } from "@/data/medicine-data";

// Extend to simulate 150+ medicines if not already defined
const ALL_MEDICINES = [...ENHANCED_MEDICINES, ...ADDITIONAL_MEDICINES];

// Generate quiz questions
const generateQuizQuestions = (medicines: HomeopathicMedicine[]): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  
  medicines.slice(0, 10).forEach((medicine) => {
    questions.push({
      id: questions.length + 1,
      question: `What is ${medicine.name} primarily used for?`,
      options: [
        medicine.primaryUses[0],
        "High fever with delirium",
        "Digestive problems only", 
        "Skin conditions only"
      ],
      correctAnswer: 0,
      explanation: `${medicine.name} is known for: ${medicine.primaryUses.join(', ')}. Source: ${medicine.source}`,
      medicineId: medicine.id
    });

    if (medicine.keynotes.length > 0) {
      questions.push({
        id: questions.length + 1,
        question: `What is a key characteristic of ${medicine.name}?`,
        options: [
          medicine.keynotes[0],
          "Always better from heat",
          "Causes drowsiness",
          "Only works in high potencies"
        ],
        correctAnswer: 0,
        explanation: `Key note for ${medicine.name}: ${medicine.keynotes[0]}. This helps distinguish it from other remedies.`,
        medicineId: medicine.id
      });
    }
  });

  return questions;
};

const QUIZ_QUESTIONS = generateQuizQuestions(ALL_MEDICINES);

export default function LearningPage() {
  return (
    <EnhancedLearningAssistantUI 
      medicines={ALL_MEDICINES}
      quizQuestions={QUIZ_QUESTIONS}
    />
  );
}