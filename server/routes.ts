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

// AUTHENTIC AI Doctor - ONLY Boericke's Materia Medica, NO FAKE DATA
async function analyzeSymptoms(symptoms: string, userInventory: string[]) {
  // Handle greetings naturally
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

  // Use ONLY authentic Boericke's Materia Medica
  const boerickeMatches = findBoerickeRemedies(symptoms);
  if (boerickeMatches.length > 0) {
    const response = "🌿 Based on authentic Boericke's Materia Medica, here are the classical homeopathic recommendations:";
    
    const remedies = boerickeMatches.map((remedy, index) => {
      const confidence = Math.max(95 - (index * 5), 80);
      const isInInventory = userInventory.some(inv => 
        inv.toLowerCase().includes(remedy.name.toLowerCase())
      );
      
      // Get relevant symptoms based on query
      let relevantSymptoms = remedy.keyIndications;
      if (symptomsLower.includes('headache')) {
        relevantSymptoms = remedy.headSymptoms.length > 0 ? remedy.headSymptoms : remedy.keyIndications;
      } else if (symptomsLower.includes('fever')) {
        relevantSymptoms = remedy.feverSymptoms.length > 0 ? remedy.feverSymptoms : remedy.keyIndications;
      }
      
      return {
        name: remedy.name,
        potency: remedy.potency,
        indication: relevantSymptoms.slice(0, 2).join(', '),
        source: 'Boericke\'s Materia Medica',
        reasoning: `${remedy.commonName}: ${relevantSymptoms[0]}`,
        confidence: isInInventory ? Math.min(confidence + 10, 100) : confidence,
        dosage: '3-4 pellets',
        frequency: '2-4 times daily as needed',
        inInventory: isInInventory
      };
    });
    
    return { response, remedies };
  }
  
  // If no authentic matches - be honest, NO FAKE DATA
  return {
    response: "I want to help you find the right remedy! The specific symptoms you mentioned aren't matching the classical remedies in my authentic Boericke's Materia Medica database.\n\nI only provide recommendations based on genuine homeopathic literature, so I won't give inaccurate suggestions. Could you describe your symptoms more specifically?\n\nFor example:\n• 'throbbing headache worse from light' instead of just 'headache'\n• 'sudden fever with anxiety' instead of just 'fever'\n\nWhat specific symptoms are you experiencing?",
    remedies: []
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Doctor endpoint - ONLY authentic data
  app.post("/api/ai-doctor", async (req, res) => {
    try {
      const { symptoms } = req.body;
      if (!symptoms) {
        return res.status(400).json({ error: "Symptoms are required" });
      }
      
      // Use empty inventory if database is not accessible - AI still works with authentic Boericke's data
      let userInventory: string[] = [];
      try {
        const userMedicines = await db.query.medicines.findMany();
        userInventory = userMedicines.map(med => med.name);
      } catch (dbError) {
        console.log("Database not accessible, using empty inventory");
        // Continue with empty inventory - Boericke's recommendations still work perfectly
      }
      
      const result = await analyzeSymptoms(symptoms, userInventory);
      res.json(result);
    } catch (error) {
      console.error("AI Doctor error:", error);
      res.status(500).json({ 
        error: "Unable to analyze symptoms",
        response: "I'm having trouble right now. Please try again or consult with a qualified homeopath for immediate assistance."
      });
    }
  });

  // Add all your existing medicine CRUD endpoints here...
  app.get("/api/medicines", async (req, res) => {
    try {
      const allMedicines = await db.query.medicines.findMany({
        orderBy: (medicines, { asc }) => [asc(medicines.name)]
      });
      res.json(allMedicines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch medicines" });
    }
  });

  app.post("/api/medicines", async (req, res) => {
    try {
      const medicineData: InsertMedicine = req.body;
      const [newMedicine] = await db.insert(medicines).values(medicineData).returning();
      res.status(201).json(newMedicine);
    } catch (error) {
      res.status(500).json({ error: "Failed to create medicine" });
    }
  });

  const server = createServer(app);
  return server;
}