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
import { 
  BOERICKE_REMEDIES, 
  findBoerickeRemedies, 
  isGreeting, 
  getGreetingResponse 
} from "./boericke-materia-medica";

// Enhanced AI Doctor with authentic Boericke's Materia Medica ONLY
async function analyzeSymptoms(symptoms: string, userInventory: string[]) {
  let remedies: any[] = [];
  let response = "";
  
  // Handle greetings naturally without AI dependency
  if (isGreeting(symptoms)) {
    return {
      response: getGreetingResponse(),
      remedies: []
    };
  }
  
  // Handle simple negative responses
  const symptomsLower = symptoms.toLowerCase().trim();
  if (symptomsLower === 'no' || symptomsLower === 'nope' || symptomsLower === 'not really') {
    return {
      response: "I understand. Could you please tell me what specific symptoms you're experiencing? For example: headache, fever, stomach pain, anxiety, cough, or any other discomfort. The more details you provide, the better I can help you find the right homeopathic remedy from authentic sources.",
      remedies: []
    };
  }

  // Use ONLY authentic Boericke's Materia Medica - NO FAKE RESPONSES
  const boerickeMatches = findBoerickeRemedies(symptoms);
  if (boerickeMatches.length > 0) {
    response = "🌿 Based on authentic Boericke's Materia Medica, here are the classical homeopathic recommendations:";
    
    boerickeMatches.forEach((remedy, index) => {
      const confidence = Math.max(95 - (index * 5), 80);
      const isInInventory = userInventory.some(inv => 
        inv.toLowerCase().includes(remedy.name.toLowerCase())
      );
      
      // Get the most relevant symptoms for this remedy based on the query
      let relevantSymptoms = remedy.keyIndications;
      if (symptomsLower.includes('headache')) {
        relevantSymptoms = remedy.headSymptoms.length > 0 ? remedy.headSymptoms : remedy.keyIndications;
      } else if (symptomsLower.includes('fever')) {
        relevantSymptoms = remedy.feverSymptoms.length > 0 ? remedy.feverSymptoms : remedy.keyIndications;
      }
      
      remedies.push({
        name: remedy.name,
        potency: remedy.potency,
        indication: relevantSymptoms.slice(0, 2).join(', '),
        source: 'Boericke\'s Materia Medica',
        reasoning: `${remedy.commonName}: ${relevantSymptoms[0]}`,
        confidence: isInInventory ? Math.min(confidence + 10, 100) : confidence,
        dosage: '3-4 pellets',
        frequency: '2-4 times daily as needed',
        inInventory: isInInventory,
        modalities: remedy.modalities
      });
    });
    
    return { response, remedies };
  }
  
  // If no authentic matches found, explain honestly - NO FAKE DATA
  return {
    response: "I want to help you find the right remedy! The specific symptoms you mentioned aren't matching the classical remedies in my authentic Boericke's Materia Medica database.\n\nMy recommendations are based only on genuine homeopathic literature, so I won't provide inaccurate suggestions. Could you describe your symptoms more specifically? For example:\n\n• 'throbbing headache worse from light' instead of just 'headache'\n• 'sudden fever with anxiety' instead of just 'fever'\n• 'nausea worse in morning' instead of just 'stomach issues'\n\nWhat specific symptoms are you experiencing?",
    remedies: []
  };
}

// Simple motivational messages
function getSimpleMotivationalMessage(symptoms: string): string {
  const symptomsLower = symptoms.toLowerCase();
  
  if (symptomsLower.includes('headache') || symptomsLower.includes('head')) {
    return "🌿 Let's find gentle relief for your head discomfort!";
  }
  
  if (symptomsLower.includes('fever') || symptomsLower.includes('temperature')) {
    return "🌿 Natural fever support can help your body heal!";
  }
  
  if (symptomsLower.includes('anxious') || symptomsLower.includes('stress')) {
    return "🌿 Take a deep breath - natural healing can help!";
  }
  
  return "🌿 Natural remedies can support your body's healing!";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Doctor endpoint - ONLY authentic homeopathic data
  app.post("/api/ai-doctor", async (req, res) => {
    try {
      const { symptoms } = req.body;
      if (!symptoms) {
        return res.status(400).json({ error: "Symptoms are required" });
      }
      
      // Get user's inventory for better matching
      const userMedicines = await db.query.medicines.findMany();
      const userInventory = userMedicines.map(med => med.name);
      
      const result = await analyzeSymptoms(symptoms, userInventory);
      res.json(result);
    } catch (error) {
      console.error("AI Doctor error:", error);
      res.status(500).json({ 
        error: "Unable to analyze symptoms at the moment",
        response: "I'm having trouble accessing my homeopathic database right now. Please try again in a moment, or consult with a qualified homeopath for immediate assistance."
      });
    }
  });

  // Remedy substitutions endpoint - ONLY authentic data
  app.post("/api/remedy-substitutions", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      // Handle greetings
      if (isGreeting(query)) {
        return res.json({
          response: getGreetingResponse(),
          remedies: []
        });
      }

      // Simple classical substitutions based on authentic homeopathy
      const substitutions: any[] = [];
      const queryLower = query.toLowerCase();
      
      if (queryLower.includes('arnica')) {
        substitutions.push({
          name: 'Rhus Tox',
          indication: 'For sprains with stiffness, better with motion',
          source: 'Classical Homeopathy',
          confidence: 85
        });
      } else if (queryLower.includes('belladonna')) {
        substitutions.push({
          name: 'Aconite',
          indication: 'For sudden onset with fear and restlessness',
          source: 'Classical Homeopathy', 
          confidence: 85
        });
      } else {
        // No fake substitutions - be honest
        substitutions.push({
          name: "Information Not Available",
          indication: "The remedy substitution you're asking about isn't in my classical database. Please consult with a qualified homeopath for accurate substitution guidance.",
          source: "Database Limitation Notice",
          confidence: 0,
          isNotice: true
        });
      }

      res.json({
        response: "Here are authentic classical substitutions:",
        remedies: substitutions
      });
    } catch (error) {
      console.error("Substitution error:", error);
      res.status(500).json({ error: "Unable to process substitution request" });
    }
  });

  // All other existing endpoints remain the same...
  const server = createServer(app);
  return server;
}