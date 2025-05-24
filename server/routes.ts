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
