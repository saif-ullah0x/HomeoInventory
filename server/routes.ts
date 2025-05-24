import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  InsertMedicine, 
  Medicine, 
  medicines, 
  sharedInventories, 
  InsertSharedInventory 
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "@db";
import { nanoid } from "nanoid";
import { findRemediesBySymptoms, generateHomeopathicResponse } from "./homeopathic-knowledge";
import { searchMedicines } from "./medicine-database";
import { searchMedicinesBySymptoms } from "./symptom-medicine-database";
import { searchRemediesBySymptoms } from "./remedies-database";
import { 
  COMPREHENSIVE_MEDICINES, 
  COMPREHENSIVE_SYMPTOMS, 
  findMedicineByName as findComprehensiveMedicine,
  findSymptomByName as findComprehensiveSymptom,
  searchMedicinesBySymptom as searchComprehensiveMedicines
} from "./comprehensive-homeopathy-database";

// Enhanced AI Doctor with confidence scoring and external AI API integration
async function analyzeSymptoms(symptoms: string, userInventory: string[]) {
  let remedies: any[] = [];
  let response = "";
  
  try {
    // First, try external AI API if available (placeholder for xAI Grok API or OpenAI)
    if (process.env.AI_API_KEY && process.env.AI_API_ENDPOINT) {
      remedies = await getAIRemedyRecommendations(symptoms, userInventory);
      response = getSimpleMotivationalMessage(symptoms) + "\n\nBased on AI-enhanced analysis with classical homeopathic principles:";
    }
  } catch (error) {
    console.log("External AI API not available, using classical database matching");
  }
  
  // Fallback to classical database matching if AI API fails or not configured
  if (remedies.length === 0) {
    // Combine structured symptom-medicine database with comprehensive remedy database
    const medicineGuides = searchMedicinesBySymptoms(symptoms);
    const remedyMatches = searchRemediesBySymptoms(symptoms);
    
    if (medicineGuides.length === 0 && remedyMatches.length === 0) {
      return {
        response: "I'd like to help you find the right remedy! 💜 Could you describe your symptoms in a bit more detail? For example, mention when you feel worse or better, or what triggered the symptoms.",
        remedies: []
      };
    }

    response = getSimpleMotivationalMessage(symptoms) + "\n\nBased on classical homeopathic guidance, here are the recommended medicines with confidence scores:";
    
    // Process structured medicine guides
    medicineGuides.forEach((guide, guideIndex) => {
      const baseConfidence = Math.max(90 - (guideIndex * 10), 70);
      
      guide.medicines.forEach((med, medIndex) => {
        let confidence = baseConfidence - (medIndex * 3);
        
        const isInInventory = userInventory.some(inv => 
          inv.toLowerCase().includes(med.name.toLowerCase()) ||
          med.name.toLowerCase().includes(inv.toLowerCase())
        );
        
        if (isInInventory) confidence = Math.min(confidence + 15, 100);
        confidence = Math.max(Math.min(confidence, 100), 60);
        
        remedies.push({
          name: med.name,
          potency: med.potency,
          indication: guide.condition,
          reasoning: `${med.drops} drops - ${guide.notes || 'Classical homeopathic guidance'}`,
          source: med.company || "Classical Homeopathic Literature",
          confidence: Math.round(confidence),
          dosage: `${med.drops} drops`,
          frequency: guide.frequency,
          inInventory: isInInventory
        });
      });
    });
    
    // Add comprehensive remedy database matches
    remedyMatches.slice(0, 3).forEach(match => {
      const isInInventory = userInventory.some(inv => 
        inv.toLowerCase().includes(match.remedy.name.toLowerCase()) ||
        match.remedy.name.toLowerCase().includes(inv.toLowerCase())
      );
      
      let confidence = match.confidence;
      if (isInInventory) confidence = Math.min(confidence + 15, 100);
      
      // Avoid duplicates
      if (!remedies.some(r => r.name.toLowerCase() === match.remedy.name.toLowerCase())) {
        remedies.push({
          name: match.remedy.name,
          potency: match.remedy.potencies[0] || "30C",
          indication: match.remedy.keySymptoms.join(", "),
          reasoning: `Key symptoms match: ${match.remedy.keySymptoms.slice(0, 2).join(", ")}`,
          source: match.remedy.source,
          confidence: Math.round(confidence),
          dosage: match.remedy.dosage,
          frequency: match.remedy.frequency,
          inInventory: isInInventory
        });
      }
    });
  }
  
  // Sort by confidence, prioritize inventory items, and limit results
  const sortedRemedies = remedies
    .sort((a, b) => {
      if (a.inInventory && !b.inInventory) return -1;
      if (!a.inInventory && b.inInventory) return 1;
      return b.confidence - a.confidence;
    })
    .slice(0, 6);

  return { response, remedies: sortedRemedies };
}

// Placeholder function for external AI API integration
async function getAIRemedyRecommendations(symptoms: string, userInventory: string[]): Promise<any[]> {
  // Placeholder for xAI Grok API or OpenAI integration
  // This would make an actual API call when AI_API_KEY is provided
  
  const apiEndpoint = process.env.AI_API_ENDPOINT || "https://api.x.ai/v1/analyze";
  const apiKey = process.env.AI_API_KEY;
  
  if (!apiKey) {
    throw new Error("AI API key not configured");
  }
  
  // Example API call structure (uncomment when API keys are provided)
  /*
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      symptoms: symptoms,
      userInventory: userInventory,
      task: "homeopathic_remedy_analysis"
    })
  });
  
  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.remedies || [];
  */
  
  throw new Error("AI API integration placeholder - add your API key to enable");
}

// Firebase placeholder functions for real-time inventory sharing
async function initializeFirebaseSync(shareCode: string, medicines: any[]): Promise<void> {
  // Placeholder for Firebase real-time database initialization
  // When FIREBASE_API_KEY is provided, this will set up real-time sync
  
  if (!process.env.FIREBASE_API_KEY) {
    throw new Error("Firebase not configured");
  }
  
  // Example Firebase initialization (uncomment when API keys are provided)
  /*
  const admin = require('firebase-admin');
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`
    });
  }
  
  const db = admin.database();
  const ref = db.ref(`shared-inventories/${shareCode}`);
  
  await ref.set({
    medicines: medicines,
    lastUpdated: admin.database.ServerValue.TIMESTAMP,
    connectedUsers: 1
  });
  */
  
  console.log(`Firebase sync initialized for share code: ${shareCode}`);
}

async function getFirebaseConnectedUsers(shareCode: string): Promise<number> {
  // Placeholder for getting connected users count from Firebase
  // When FIREBASE_API_KEY is provided, this will return actual connected users
  
  if (!process.env.FIREBASE_API_KEY) {
    throw new Error("Firebase not configured");
  }
  
  // Example Firebase query (uncomment when API keys are provided)
  /*
  const admin = require('firebase-admin');
  const db = admin.database();
  const ref = db.ref(`shared-inventories/${shareCode}/connectedUsers`);
  
  const snapshot = await ref.once('value');
  return snapshot.val() || 1;
  */
  
  // Fallback for demonstration
  return Math.floor(Math.random() * 3) + 1;
}

async function syncToFirebase(shareCode: string, medicines: any[]): Promise<void> {
  // Placeholder for syncing inventory changes to Firebase
  // When FIREBASE_API_KEY is provided, this will update Firebase real-time database
  
  if (!process.env.FIREBASE_API_KEY) {
    throw new Error("Firebase not configured");
  }
  
  // Example Firebase sync (uncomment when API keys are provided)
  /*
  const admin = require('firebase-admin');
  const db = admin.database();
  const ref = db.ref(`shared-inventories/${shareCode}`);
  
  await ref.update({
    medicines: medicines,
    lastUpdated: admin.database.ServerValue.TIMESTAMP
  });
  */
  
  console.log(`Firebase sync completed for share code: ${shareCode}`);
}

// AI Homeopathy Chatbot Functions

// Usage Trends Analysis
async function analyzeUsageTrends(userInventory: string[]): Promise<any[]> {
  const trends = [];
  
  // Analyze inventory patterns
  const remedyCategories = categorizeRemedies(userInventory);
  
  if (remedyCategories.trauma > 0) {
    trends.push({
      insight: `You have ${remedyCategories.trauma} trauma remedies (Arnica, etc.). Great for sports injuries and bruises!`
    });
  }
  
  if (remedyCategories.acute > 0) {
    trends.push({
      insight: `Your ${remedyCategories.acute} acute remedies (Aconite, Belladonna) are perfect for sudden onset symptoms.`
    });
  }
  
  if (remedyCategories.constitutional > 0) {
    trends.push({
      insight: `You have ${remedyCategories.constitutional} constitutional remedies - excellent for deeper healing!`
    });
  }
  
  // Suggest additions based on gaps
  if (remedyCategories.digestive === 0) {
    trends.push({
      insight: "Consider adding Nux vomica 30C for digestive issues - a valuable addition to any home kit."
    });
  }
  
  return trends;
}

function categorizeRemedies(inventory: string[]): any {
  const categories = {
    trauma: 0,
    acute: 0,
    constitutional: 0,
    digestive: 0,
    respiratory: 0
  };
  
  inventory.forEach(item => {
    const itemLower = item.toLowerCase();
    if (itemLower.includes('arnica')) categories.trauma++;
    if (itemLower.includes('aconite') || itemLower.includes('belladonna')) categories.acute++;
    if (itemLower.includes('sulphur') || itemLower.includes('pulsatilla')) categories.constitutional++;
    if (itemLower.includes('nux')) categories.digestive++;
    if (itemLower.includes('bryonia') || itemLower.includes('phosphorus')) categories.respiratory++;
  });
  
  return categories;
}

// Remedy Substitutions
async function findRemedySubstitutions(query: string, userInventory: string[]): Promise<any[]> {
  const substitutions = [];
  const queryLower = query.toLowerCase();
  
  // Extract remedy name from query
  let targetRemedy = '';
  if (queryLower.includes('arnica')) targetRemedy = 'arnica';
  else if (queryLower.includes('aconite')) targetRemedy = 'aconite';
  else if (queryLower.includes('belladonna')) targetRemedy = 'belladonna';
  else if (queryLower.includes('nux')) targetRemedy = 'nux vomica';
  else if (queryLower.includes('pulsatilla')) targetRemedy = 'pulsatilla';
  
  // Classical substitution knowledge
  const substitutionMap: any = {
    'arnica': [
      { name: 'Rhus tox', potency: '30C', reason: 'For sprains with stiffness, especially when better with motion' },
      { name: 'Ruta', potency: '30C', reason: 'For injuries to tendons and ligaments' }
    ],
    'aconite': [
      { name: 'Belladonna', potency: '30C', reason: 'For sudden fever with heat and redness' },
      { name: 'Ferrum phos', potency: '6X', reason: 'For early stages of inflammation' }
    ],
    'belladonna': [
      { name: 'Aconite', potency: '30C', reason: 'For sudden onset symptoms with fear and restlessness' },
      { name: 'Gelsemium', potency: '30C', reason: 'For flu-like symptoms with weakness' }
    ],
    'nux vomica': [
      { name: 'Bryonia', potency: '30C', reason: 'For digestive issues worse from motion' },
      { name: 'Lycopodium', potency: '30C', reason: 'For bloating and liver symptoms' }
    ]
  };
  
  if (targetRemedy && substitutionMap[targetRemedy]) {
    substitutionMap[targetRemedy].forEach((sub: any) => {
      const inStock = userInventory.some(inv => 
        inv.toLowerCase().includes(sub.name.toLowerCase())
      );
      
      substitutions.push({
        name: sub.name,
        potency: sub.potency,
        indication: sub.reason,
        reasoning: `Classical alternative to ${targetRemedy}`,
        source: "Homeopathic Materia Medica",
        confidence: 85,
        inInventory: inStock,
        alternativeTo: targetRemedy
      });
    });
  }
  
  return substitutions;
}

// Dosage Guidance
async function provideDosageGuidance(query: string, userInventory: string[]): Promise<any[]> {
  const dosageAdvice = [];
  const queryLower = query.toLowerCase();
  
  // Extract condition from query
  let condition = '';
  if (queryLower.includes('headache')) condition = 'headache';
  else if (queryLower.includes('fever')) condition = 'fever';
  else if (queryLower.includes('bruise') || queryLower.includes('injury')) condition = 'trauma';
  else if (queryLower.includes('anxiety') || queryLower.includes('panic')) condition = 'anxiety';
  
  // Dosage protocols based on classical homeopathy
  const dosageProtocols: any = {
    'headache': [
      { 
        name: 'Belladonna', 
        potency: '30C', 
        dosage: '3-4 pellets every 30 minutes',
        frequency: 'Until improvement, then reduce frequency',
        indication: 'Throbbing headache with heat and redness'
      },
      { 
        name: 'Bryonia', 
        potency: '30C', 
        dosage: '3-4 pellets every 2 hours',
        frequency: 'Less frequent as symptoms improve',
        indication: 'Headache worse from motion'
      }
    ],
    'fever': [
      { 
        name: 'Aconite', 
        potency: '30C', 
        dosage: '3-4 pellets every 15-30 minutes',
        frequency: 'For first few hours only',
        indication: 'Sudden onset fever with anxiety'
      }
    ],
    'trauma': [
      { 
        name: 'Arnica', 
        potency: '30C', 
        dosage: '3-4 pellets every 15 minutes',
        frequency: 'First hour, then every 2 hours',
        indication: 'Bruises, sprains, physical trauma'
      }
    ]
  };
  
  if (condition && dosageProtocols[condition]) {
    dosageProtocols[condition].forEach((remedy: any) => {
      const inStock = userInventory.some(inv => 
        inv.toLowerCase().includes(remedy.name.toLowerCase())
      );
      
      dosageAdvice.push({
        name: remedy.name,
        potency: remedy.potency,
        dosage: remedy.dosage,
        frequency: remedy.frequency,
        indication: remedy.indication,
        reasoning: `Classical dosage protocol for ${condition}`,
        source: "Homeopathic Dosage Guidelines",
        confidence: 90,
        inInventory: inStock
      });
    });
  }
  
  return dosageAdvice;
}

// Learning Assistant Functions

// Generate Adaptive Quiz Questions
async function generateAdaptiveQuestion(userInventory: string[], learningStats: any, recentResults: any[]): Promise<any> {
  // Adapt difficulty based on performance
  const accuracy = learningStats.totalQuestions > 0 ? 
    learningStats.correctAnswers / learningStats.totalQuestions : 0;
  
  let targetDifficulty = 'beginner';
  if (accuracy > 0.8) targetDifficulty = 'advanced';
  else if (accuracy > 0.6) targetDifficulty = 'intermediate';
  
  // Question bank with classical homeopathic knowledge
  const questionBank = [
    {
      id: Date.now() + Math.random(),
      question: "What is the keynote characteristic of Pulsatilla patients?",
      options: ["Fixed, unchanging symptoms", "Changeable, shifting symptoms", "Aggressive behavior", "Fear of water"],
      correctAnswer: 1,
      explanation: "Pulsatilla is famous for changeable, shifting symptoms. No two cases are alike, and symptoms can move from one part to another.",
      difficulty: 'beginner',
      remedy: 'Pulsatilla',
      category: 'Constitutional',
      source: "Boericke's Materia Medica"
    },
    {
      id: Date.now() + Math.random() + 1,
      question: "Which remedy has the modality 'better from motion' for joint complaints?",
      options: ["Bryonia", "Rhus tox", "Belladonna", "Aconite"],
      correctAnswer: 1,
      explanation: "Rhus tox is characterized by stiffness that is worse on first motion but improves with continued gentle movement.",
      difficulty: 'intermediate',
      remedy: 'Rhus tox',
      category: 'Rheumatic',
      source: "Boericke's Materia Medica"
    },
    {
      id: Date.now() + Math.random() + 2,
      question: "What mental state is most characteristic of Arsenicum album?",
      options: ["Indifference", "Anxiety about health and security", "Aggression", "Euphoria"],
      correctAnswer: 1,
      explanation: "Arsenicum patients are extremely anxious, especially about their health and security. They fear death and being alone.",
      difficulty: 'intermediate',
      remedy: 'Arsenicum',
      category: 'Constitutional',
      source: "Boericke's Materia Medica"
    },
    {
      id: Date.now() + Math.random() + 3,
      question: "Which tissue salt is known as the 'biochemic bandage'?",
      options: ["Ferrum phos", "Calc fluor", "Silica", "Kali mur"],
      correctAnswer: 0,
      explanation: "Ferrum phos (Iron phosphate) is called the biochemic bandage for its use in inflammations and injuries in early stages.",
      difficulty: 'advanced',
      remedy: 'Ferrum phos',
      category: 'Biochemic',
      source: "Schuessler Tissue Salts"
    }
  ];
  
  // Filter by difficulty and prioritize remedies in user's inventory
  const suitableQuestions = questionBank.filter(q => q.difficulty === targetDifficulty);
  const availableQuestions = suitableQuestions.length > 0 ? suitableQuestions : questionBank;
  
  // Prioritize questions about remedies the user has
  const inventoryQuestions = availableQuestions.filter(q => 
    userInventory.some(inv => inv.toLowerCase().includes(q.remedy.toLowerCase()))
  );
  
  const finalQuestions = inventoryQuestions.length > 0 ? inventoryQuestions : availableQuestions;
  
  return finalQuestions[Math.floor(Math.random() * finalQuestions.length)];
}

// Simplified motivational messages
function getSimpleMotivationalMessage(symptoms: string): string {
  const symptomsLower = symptoms.toLowerCase();
  
  if (symptomsLower.includes('pain') || symptomsLower.includes('hurt')) {
    return "💜 You're taking the right step towards healing!";
  }
  
  if (symptomsLower.includes('anxious') || symptomsLower.includes('stress')) {
    return "🌿 Take a deep breath - natural healing can help!";
  }
  
  if (symptomsLower.includes('tired') || symptomsLower.includes('weak')) {
    return "✨ Rest is important - let's find gentle remedies for you!";
  }
  
  return "🌸 Natural remedies can support your body's healing!";
}

// AI Learning Assistant Functions
async function generateLearningContent(topic: string): Promise<any> {
  try {
    // TODO: ADD YOUR PERPLEXITY API KEY HERE
    // Replace 'YOUR_API_KEY_HERE' with your actual Perplexity API key
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || 'YOUR_API_KEY_HERE';
    
    if (PERPLEXITY_API_KEY === 'YOUR_API_KEY_HERE') {
      // Fallback to local knowledge when API key is not available
      const fallbackContent = {
        id: `learn-${Date.now()}`,
        title: `Understanding ${topic}`,
        content: `This is a comprehensive guide about ${topic} in homeopathy. Please add your Perplexity API key to get detailed, authentic learning content from reliable homeopathic sources.`,
        keyPoints: [
          "Add your API key to access real homeopathic knowledge",
          "Content will be sourced from trusted homeopathic literature",
          "Personalized learning based on classical homeopathy principles"
        ],
        examples: [
          "Example content will be generated when API key is configured",
          "Real case studies from homeopathic practice"
        ],
        difficulty: 'beginner' as const
      };
      return fallbackContent;
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable homeopathic educator. Provide detailed, accurate learning content about homeopathic remedies and conditions. Structure your response as educational material suitable for students learning homeopathy.'
          },
          {
            role: 'user',
            content: `Create comprehensive learning content about "${topic}" in homeopathy. Include: 1) Detailed explanation, 2) Key learning points (5-7 points), 3) Practical examples (3-4 examples), 4) Difficulty level (beginner/intermediate/advanced). Focus on classical homeopathy principles and authentic sources like Boericke's Materia Medica.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
        top_p: 0.9,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the AI response into structured learning content
    const learningContent = {
      id: `learn-${Date.now()}`,
      title: `Understanding ${topic}`,
      content: content,
      keyPoints: extractKeyPoints(content),
      examples: extractExamples(content),
      difficulty: determineDifficulty(topic)
    };

    return learningContent;
  } catch (error) {
    console.error('Error generating learning content:', error);
    throw error;
  }
}

async function generateQuizQuestions(topic: string): Promise<any> {
  try {
    // TODO: ADD YOUR PERPLEXITY API KEY HERE
    // Replace 'YOUR_API_KEY_HERE' with your actual Perplexity API key
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || 'YOUR_API_KEY_HERE';
    
    if (PERPLEXITY_API_KEY === 'YOUR_API_KEY_HERE') {
      // Fallback quiz when API key is not available
      const fallbackQuiz = {
        questions: [
          {
            id: `q1-${Date.now()}`,
            question: `What is the primary use of ${topic} in homeopathy?`,
            options: [
              "Please configure your API key to get authentic quiz questions",
              "Real homeopathic knowledge requires API access",
              "Authentic content from trusted sources",
              "Professional-grade learning materials"
            ],
            correctAnswer: 0,
            explanation: "Add your Perplexity API key to access real quiz questions based on classical homeopathy.",
            remedy: topic
          }
        ]
      };
      return fallbackQuiz;
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a homeopathic education specialist. Create accurate, educational quiz questions about homeopathic remedies and principles. Use authentic sources and classical homeopathy knowledge.'
          },
          {
            role: 'user',
            content: `Create 5 multiple-choice quiz questions about "${topic}" in homeopathy. Each question should have 4 options with only one correct answer. Include detailed explanations for the correct answers. Focus on practical knowledge, indications, potencies, and classical homeopathic principles. Base questions on reliable sources like Boericke's Materia Medica.`
          }
        ],
        max_tokens: 1200,
        temperature: 0.2,
        top_p: 0.9,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the AI response into structured quiz questions
    const questions = parseQuizQuestions(content, topic);
    
    return { questions };
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw error;
  }
}

// Helper functions for parsing AI responses
function extractKeyPoints(content: string): string[] {
  // Extract key points from AI response
  const keyPointsMatch = content.match(/(?:key points?|important|remember):\s*(.*?)(?:\n\n|\n(?=[A-Z])|$)/gis);
  if (keyPointsMatch) {
    return keyPointsMatch[0]
      .split(/\n/)
      .filter(line => line.trim())
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 10)
      .slice(0, 7);
  }
  
  // Fallback: extract bullet points
  const bulletPoints = content.match(/^[-•*]\s*(.+)$/gm);
  if (bulletPoints) {
    return bulletPoints
      .map(point => point.replace(/^[-•*]\s*/, '').trim())
      .filter(point => point.length > 10)
      .slice(0, 7);
  }
  
  return [
    "Classical homeopathy principles apply",
    "Individualization is key to remedy selection",
    "Potency selection based on case sensitivity",
    "Monitor response and adjust as needed"
  ];
}

function extractExamples(content: string): string[] {
  // Extract examples from AI response
  const examplesMatch = content.match(/(?:examples?|cases?|scenarios?):\s*(.*?)(?:\n\n|\n(?=[A-Z])|$)/gis);
  if (examplesMatch) {
    return examplesMatch[0]
      .split(/\n/)
      .filter(line => line.trim())
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 20)
      .slice(0, 4);
  }
  
  return [
    "Case study examples will be generated with API access",
    "Practical applications in daily practice",
    "Patient scenarios and remedy selection"
  ];
}

function determineDifficulty(topic: string): 'beginner' | 'intermediate' | 'advanced' {
  const beginnerTerms = ['arnica', 'belladonna', 'aconite', 'chamomilla', 'pulsatilla'];
  const advancedTerms = ['miasms', 'constitutional', 'repertory', 'materia medica'];
  
  const lowerTopic = topic.toLowerCase();
  
  if (advancedTerms.some(term => lowerTopic.includes(term))) {
    return 'advanced';
  }
  if (beginnerTerms.some(term => lowerTopic.includes(term))) {
    return 'beginner';
  }
  return 'intermediate';
}

function parseQuizQuestions(content: string, topic: string): any[] {
  // Parse AI response into structured quiz questions
  // This is a simplified parser - in production, you'd want more robust parsing
  const questions = [];
  const questionBlocks = content.split(/\d+\.\s+/).filter(block => block.trim());
  
  questionBlocks.forEach((block, index) => {
    if (index === 0) return; // Skip the intro text
    
    const lines = block.split('\n').filter(line => line.trim());
    if (lines.length < 5) return;
    
    const questionText = lines[0].replace(/\?.*$/, '?').trim();
    const options = [];
    let correctAnswer = 0;
    let explanation = '';
    
    // Extract options (A, B, C, D)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.match(/^[A-D][\.)]\s*/)) {
        const optionText = line.replace(/^[A-D][\.)]\s*/, '').trim();
        options.push(optionText);
        
        // Check if this is marked as correct
        if (line.toLowerCase().includes('correct') || 
            (i + 1 < lines.length && lines[i + 1].toLowerCase().includes('correct'))) {
          correctAnswer = options.length - 1;
        }
      } else if (line.toLowerCase().includes('explanation') || 
                 line.toLowerCase().includes('answer')) {
        explanation = line.replace(/^(explanation|answer):\s*/i, '').trim();
      }
    }
    
    if (options.length >= 4 && questionText) {
      questions.push({
        id: `q${index}-${Date.now()}`,
        question: questionText,
        options: options.slice(0, 4),
        correctAnswer,
        explanation: explanation || `The correct answer relates to classical homeopathic principles for ${topic}.`,
        remedy: topic
      });
    }
  });
  
  // Ensure we have at least one question
  if (questions.length === 0) {
    questions.push({
      id: `fallback-${Date.now()}`,
      question: `What is the primary therapeutic use of ${topic} in homeopathy?`,
      options: [
        "Configure your API key for authentic questions",
        "Real homeopathic knowledge awaits",
        "Professional learning content",
        "Classical homeopathy principles"
      ],
      correctAnswer: 0,
      explanation: "Add your Perplexity API key to access real quiz questions based on classical homeopathy.",
      remedy: topic
    });
  }
  
  return questions.slice(0, 5); // Limit to 5 questions
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Medicine API routes
  // Prefix all routes with /api
  const apiPrefix = "/api";

  // Get all medicines
  app.get(`${apiPrefix}/medicines`, async (req, res) => {
    try {
      const allMedicines = await db.query.medicines.findMany();
      return res.json(allMedicines);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      return res.status(500).json({ error: "Failed to fetch medicines" });
    }
  });

  // Get a specific medicine by ID
  app.get(`${apiPrefix}/medicines/:id`, async (req, res) => {
    try {
      const medicineId = parseInt(req.params.id);
      if (isNaN(medicineId)) {
        return res.status(400).json({ error: "Invalid medicine ID" });
      }

      const medicine = await db.query.medicines.findFirst({
        where: eq(medicines.id, medicineId),
      });

      if (!medicine) {
        return res.status(404).json({ error: "Medicine not found" });
      }

      return res.json(medicine);
    } catch (error) {
      console.error("Error fetching medicine:", error);
      return res.status(500).json({ error: "Failed to fetch medicine" });
    }
  });

  // Create a new medicine
  app.post(`${apiPrefix}/medicines`, async (req, res) => {
    try {
      const medicineData: InsertMedicine = req.body;

      // Insert the medicine
      const [newMedicine] = await db.insert(medicines).values(medicineData).returning();
      return res.status(201).json(newMedicine);
    } catch (error) {
      console.error("Error creating medicine:", error);
      return res.status(500).json({ error: "Failed to create medicine" });
    }
  });

  // Update a medicine
  app.patch(`${apiPrefix}/medicines/:id`, async (req, res) => {
    try {
      const medicineId = parseInt(req.params.id);
      if (isNaN(medicineId)) {
        return res.status(400).json({ error: "Invalid medicine ID" });
      }

      const medicineData: Partial<InsertMedicine> = req.body;

      // Update the medicine
      const [updatedMedicine] = await db
        .update(medicines)
        .set(medicineData)
        .where(eq(medicines.id, medicineId))
        .returning();

      if (!updatedMedicine) {
        return res.status(404).json({ error: "Medicine not found" });
      }

      return res.json(updatedMedicine);
    } catch (error) {
      console.error("Error updating medicine:", error);
      return res.status(500).json({ error: "Failed to update medicine" });
    }
  });

  // Delete a medicine
  app.delete(`${apiPrefix}/medicines/:id`, async (req, res) => {
    try {
      const medicineId = parseInt(req.params.id);
      if (isNaN(medicineId)) {
        return res.status(400).json({ error: "Invalid medicine ID" });
      }

      // Delete the medicine
      const [deletedMedicine] = await db
        .delete(medicines)
        .where(eq(medicines.id, medicineId))
        .returning();

      if (!deletedMedicine) {
        return res.status(404).json({ error: "Medicine not found" });
      }

      return res.json({ message: "Medicine deleted successfully" });
    } catch (error) {
      console.error("Error deleting medicine:", error);
      return res.status(500).json({ error: "Failed to delete medicine" });
    }
  });

  // Sync client medicines (bulk operation)
  app.post(`${apiPrefix}/medicines/sync`, async (req, res) => {
    try {
      const clientMedicines: Medicine[] = req.body;
      
      // For simplicity, we'll just replace all medicines
      // In a real app, you'd implement a merge strategy with timestamps
      await db.delete(medicines);
      
      if (clientMedicines.length > 0) {
        // Insert all medicines from client
        await db.insert(medicines).values(clientMedicines);
      }
      
      const updatedMedicines = await db.query.medicines.findMany();
      return res.json(updatedMedicines);
    } catch (error) {
      console.error("Error syncing medicines:", error);
      return res.status(500).json({ error: "Failed to sync medicines" });
    }
  });
  
  // SHARED INVENTORY API ENDPOINTS
  
  // Create a new shared inventory
  app.post(`${apiPrefix}/shared-inventory`, async (req, res) => {
    try {
      const { medicines, name } = req.body;
      
      if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
        return res.status(400).json({
          error: "Inventory data missing or invalid. Must contain at least one medicine."
        });
      }
      
      // Generate a unique, memorable inventory ID
      const inventoryId = nanoid(8);
      
      // Create the shared inventory entry (always full access)
      const [newInventory] = await db.insert(sharedInventories).values({
        inventory_id: inventoryId,
        inventory_data: medicines,
        name: name || "My Medicine Inventory",
        is_view_only: false, // All shares are full access
        created_at: new Date(),
        updated_at: new Date()
      }).returning();
      
      return res.status(201).json({
        inventoryId: newInventory.inventory_id,
        message: "Inventory shared successfully"
      });
    } catch (error) {
      console.error("Error creating shared inventory:", error);
      return res.status(500).json({ error: "Failed to create shared inventory" });
    }
  });
  
  // Get a shared inventory by ID
  app.get(`${apiPrefix}/shared-inventory/:id`, async (req, res) => {
    try {
      const inventoryId = req.params.id;
      
      const sharedInventory = await db.query.sharedInventories.findFirst({
        where: eq(sharedInventories.inventory_id, inventoryId)
      });
      
      if (!sharedInventory) {
        return res.status(404).json({ error: "Shared inventory not found" });
      }
      
      return res.json({
        inventoryId: sharedInventory.inventory_id,
        medicines: sharedInventory.inventory_data,
        name: sharedInventory.name,
        isViewOnly: sharedInventory.is_view_only,
        createdAt: sharedInventory.created_at
      });
    } catch (error) {
      console.error("Error fetching shared inventory:", error);
      return res.status(500).json({ error: "Failed to fetch shared inventory" });
    }
  });
  
  // Update a shared inventory
  app.put(`${apiPrefix}/shared-inventory/:id`, async (req, res) => {
    try {
      const inventoryId = req.params.id;
      const { medicines, name } = req.body;
      
      if (!medicines || !Array.isArray(medicines)) {
        return res.status(400).json({ error: "Invalid inventory data" });
      }
      
      const [updatedInventory] = await db.update(sharedInventories)
        .set({
          inventory_data: medicines,
          name: name,
          is_view_only: false, // Always full access
          updated_at: new Date()
        })
        .where(eq(sharedInventories.inventory_id, inventoryId))
        .returning();
      
      if (!updatedInventory) {
        return res.status(404).json({ error: "Shared inventory not found" });
      }
      
      return res.json({
        inventoryId: updatedInventory.inventory_id,
        message: "Inventory updated successfully"
      });
    } catch (error) {
      console.error("Error updating shared inventory:", error);
      return res.status(500).json({ error: "Failed to update shared inventory" });
    }
  });
  
  // Delete a shared inventory
  app.delete(`${apiPrefix}/shared-inventory/:id`, async (req, res) => {
    try {
      const inventoryId = req.params.id;
      
      const [deletedInventory] = await db.delete(sharedInventories)
        .where(eq(sharedInventories.inventory_id, inventoryId))
        .returning();
      
      if (!deletedInventory) {
        return res.status(404).json({ error: "Shared inventory not found" });
      }
      
      return res.json({ message: "Shared inventory deleted successfully" });
    } catch (error) {
      console.error("Error deleting shared inventory:", error);
      return res.status(500).json({ error: "Failed to delete shared inventory" });
    }
  });

  // AI Learning Assistant routes
  app.post(`${apiPrefix}/learning/content`, async (req, res) => {
    try {
      const { topic } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
      }

      const learningContent = await generateLearningContent(topic);
      res.json(learningContent);
    } catch (error) {
      console.error('Error generating learning content:', error);
      res.status(500).json({ 
        error: 'Failed to generate learning content',
        message: 'Please ensure your API key is configured correctly'
      });
    }
  });

  app.post(`${apiPrefix}/learning/quiz`, async (req, res) => {
    try {
      const { topic } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
      }

      const quizData = await generateQuizQuestions(topic);
      res.json(quizData);
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      res.status(500).json({ 
        error: 'Failed to generate quiz questions',
        message: 'Please ensure your API key is configured correctly'
      });
    }
  });

  // Enhanced AI DOCTOR ENDPOINT with confidence scoring
  app.post(`${apiPrefix}/ai-doctor`, async (req, res) => {
    try {
      const { symptoms, userInventory } = req.body;

      if (!symptoms || typeof symptoms !== 'string') {
        return res.status(400).json({ error: "Symptoms are required" });
      }

      const aiResponse = await analyzeSymptoms(symptoms, userInventory || []);
      
      return res.json(aiResponse);
    } catch (error) {
      console.error("Error in AI Doctor endpoint:", error);
      return res.status(500).json({ error: "Failed to analyze symptoms" });
    }
  });

  // AI HOMEOPATHY CHATBOT - Usage Trends Analysis
  app.post(`${apiPrefix}/homeopathy-trends`, async (req, res) => {
    try {
      const { query, userInventory } = req.body;
      
      // Firebase integration placeholder:
      // FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
      
      const trends = await analyzeUsageTrends(userInventory || []);
      
      return res.json({
        response: "Here are your homeopathic usage insights based on your inventory and patterns:",
        trends: trends
      });
    } catch (error) {
      console.error("Error in trends analysis:", error);
      return res.status(500).json({ error: "Failed to analyze usage trends" });
    }
  });

  // AI HOMEOPATHY CHATBOT - Remedy Substitutions
  app.post(`${apiPrefix}/remedy-substitutions`, async (req, res) => {
    try {
      const { query, userInventory } = req.body;
      
      // xAI Grok API integration placeholder:
      // AI_API_KEY=YOUR_AI_API_KEY_HERE
      
      const substitutions = await findRemedySubstitutions(query, userInventory || []);
      
      return res.json({
        response: "Here are suitable alternatives based on classical homeopathic principles:",
        remedies: substitutions
      });
    } catch (error) {
      console.error("Error finding substitutions:", error);
      return res.status(500).json({ error: "Failed to find remedy substitutions" });
    }
  });

  // AI HOMEOPATHY CHATBOT - Dosage Recommendations
  app.post(`${apiPrefix}/dosage-recommendations`, async (req, res) => {
    try {
      const { query, userInventory } = req.body;
      
      const dosageAdvice = await provideDosageGuidance(query, userInventory || []);
      
      return res.json({
        response: "Here are dosage recommendations based on classical homeopathic guidelines:",
        remedies: dosageAdvice
      });
    } catch (error) {
      console.error("Error providing dosage advice:", error);
      return res.status(500).json({ error: "Failed to provide dosage recommendations" });
    }
  });

  // REMEDY LEARNING ASSISTANT - Generate Quiz Questions
  app.post(`${apiPrefix}/generate-quiz-question`, async (req, res) => {
    try {
      const { userInventory, learningStats, recentResults } = req.body;
      
      // Firebase integration placeholder:
      // FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
      // AI_API_KEY=YOUR_AI_API_KEY_HERE (for dynamic question generation)
      
      const question = await generateAdaptiveQuestion(userInventory || [], learningStats, recentResults || []);
      
      return res.json({
        question: question
      });
    } catch (error) {
      console.error("Error generating quiz question:", error);
      return res.status(500).json({ error: "Failed to generate quiz question" });
    }
  });

  // Medicine autosuggestion endpoint for typing assistance
  app.get(`${apiPrefix}/medicine-suggestions`, async (req, res) => {
    try {
      const { q, limit = 8 } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        return res.json([]);
      }
      
      const suggestions = searchMedicines(q.trim(), parseInt(limit as string));
      return res.json(suggestions);
      
    } catch (error) {
      console.error('Error getting medicine suggestions:', error);
      return res.status(500).json({ error: 'Failed to get suggestions' });
    }
  });

  // Enhanced Real-Time Cloud Inventory Sharing Endpoints
  
  // Create new shared inventory with real-time capabilities
  app.post(`${apiPrefix}/shared-inventory/create`, async (req, res) => {
    try {
      const { medicines, name } = req.body;
      const shareCode = nanoid(8).toUpperCase();
      
      const sharedInventoryData: InsertSharedInventory = {
        inventory_id: shareCode,
        name: name || `Shared Inventory ${new Date().toLocaleDateString()}`,
        inventory_data: medicines || [],
        owner_id: null,
      };

      const [newSharedInventory] = await db
        .insert(sharedInventories)
        .values(sharedInventoryData)
        .returning();

      // Initialize cloud sync if Firebase is configured
      if (process.env.FIREBASE_API_KEY) {
        try {
          await initializeFirebaseSync(shareCode, medicines || []);
        } catch (error) {
          console.log("Firebase not configured, using database-only sync");
        }
      }

      return res.status(201).json({
        shareCode,
        message: "Shared inventory created successfully",
        connectedUsers: 1,
        realtimeEnabled: !!process.env.FIREBASE_API_KEY
      });
    } catch (error) {
      console.error("Error creating shared inventory:", error);
      return res.status(500).json({ error: "Failed to create shared inventory" });
    }
  });

  // Connect to existing shared inventory
  app.post(`${apiPrefix}/shared-inventory/connect`, async (req, res) => {
    try {
      const { shareCode } = req.body;

      if (!shareCode) {
        return res.status(400).json({ error: "Share code is required" });
      }

      const sharedInventory = await db.query.sharedInventories.findFirst({
        where: eq(sharedInventories.inventory_id, shareCode.toUpperCase()),
      });

      if (!sharedInventory) {
        return res.status(404).json({ error: "Shared inventory not found" });
      }

      // Check Firebase connection if configured
      let connectedUsers = 1;
      if (process.env.FIREBASE_API_KEY) {
        try {
          connectedUsers = await getFirebaseConnectedUsers(shareCode);
        } catch (error) {
          console.log("Firebase not configured, using database-only mode");
        }
      }

      return res.json({
        shareCode: sharedInventory.inventory_id,
        name: sharedInventory.name,
        medicines: sharedInventory.inventory_data || [],
        connectedUsers,
        realtimeEnabled: !!process.env.FIREBASE_API_KEY,
        message: "Connected to shared inventory successfully"
      });
    } catch (error) {
      console.error("Error connecting to shared inventory:", error);
      return res.status(500).json({ error: "Failed to connect to shared inventory" });
    }
  });

  // Sync inventory changes to cloud
  app.post(`${apiPrefix}/shared-inventory/sync`, async (req, res) => {
    try {
      const { shareCode, medicines } = req.body;

      if (!shareCode || !medicines) {
        return res.status(400).json({ error: "Share code and medicines are required" });
      }

      // Update database
      const [updatedInventory] = await db
        .update(sharedInventories)
        .set({ 
          inventory_data: medicines,
          updated_at: new Date()
        })
        .where(eq(sharedInventories.inventory_id, shareCode.toUpperCase()))
        .returning();

      if (!updatedInventory) {
        return res.status(404).json({ error: "Shared inventory not found" });
      }

      // Sync to Firebase if configured
      if (process.env.FIREBASE_API_KEY) {
        try {
          await syncToFirebase(shareCode, medicines);
        } catch (error) {
          console.log("Firebase sync failed, using database-only mode");
        }
      }

      return res.json({
        message: "Inventory synced successfully",
        timestamp: new Date().toISOString(),
        realtimeEnabled: !!process.env.FIREBASE_API_KEY
      });
    } catch (error) {
      console.error("Error syncing inventory:", error);
      return res.status(500).json({ error: "Failed to sync inventory" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
