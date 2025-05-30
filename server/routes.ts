import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
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
// DeepSeek R1 AI Service - Consolidated AI functionality
import { deepSeekAI, type RemedySuggestion } from "./deepseek-ai-service";
// Family Inventory Service for real-time sync
import { familyInventoryService } from "./family-inventory-service";

/**
 * AI Doctor (Dr. Harmony) - Now powered by DeepSeek R1 API
 * Analyzes symptoms and provides remedy suggestions using advanced AI
 * Falls back to authentic Boericke's Materia Medica when API is unavailable
 */
async function analyzeSymptoms(symptoms: string, userInventory: string[]) {
  try {
    // Use DeepSeek R1 AI for advanced symptom analysis with authentic fallback
    const result = await deepSeekAI.analyzeSymptoms(symptoms, userInventory);
    return {
      response: result.response,
      remedies: result.remedies,
      disclaimer: result.disclaimer
    };
  } catch (error) {
    console.error('DeepSeek AI analysis failed:', error);
    
    // Fallback to authentic Boericke's Materia Medica when DeepSeek API is unavailable
    if (isGreeting(symptoms)) {
      return {
        response: getGreetingResponse(),
        remedies: [],
        disclaimer: "Always consult with a qualified homeopathic practitioner."
      };
    }
    
    const boerickeMatches = findBoerickeRemedies(symptoms);
    if (boerickeMatches.length > 0) {
      const response = "🌿 Based on authentic Boericke's Materia Medica (DeepSeek AI unavailable):";
      
      const remedies = boerickeMatches.map((remedy, index) => {
        const confidence = Math.max(90 - (index * 5), 75);
        const isInInventory = userInventory.some(inv => 
          inv.toLowerCase().includes(remedy.name.toLowerCase())
        );
        
        return {
          name: remedy.name,
          potency: remedy.potency,
          indication: remedy.keyIndications.slice(0, 2).join(', '),
          source: 'Boericke\'s Materia Medica',
          reasoning: `${remedy.commonName}: Classical homeopathic indication`,
          confidence: isInInventory ? Math.min(confidence + 10, 100) : confidence,
          dosage: '3-4 pellets',
          frequency: '2-4 times daily as needed',
          inInventory: isInInventory
        };
      });
      
      return { 
        response, 
        remedies,
        disclaimer: "🔸 Using local authentic database. For enhanced AI analysis, please configure DeepSeek API key."
      };
    }
    
    return {
      response: "I can help you find suitable remedies! For the most comprehensive analysis, please ensure the DeepSeek AI service is configured. Could you describe your symptoms more specifically?",
      remedies: [],
      disclaimer: "🔸 Enhanced AI features require DeepSeek API configuration."
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  /**
   * AI Doctor (Dr. Harmony) - DeepSeek R1 API Integration
   * Provides symptom analysis and remedy suggestions using advanced AI
   */
  app.post("/api/ai-doctor", async (req, res) => {
    try {
      const { symptoms } = req.body;
      if (!symptoms) {
        return res.status(400).json({ error: "Symptoms are required" });
      }
      
      // Get user inventory for personalized recommendations
      let userInventory: string[] = [];
      try {
        const userMedicines = await db.query.medicines.findMany();
        userInventory = userMedicines.map(med => med.name);
      } catch (dbError) {
        console.log("Database not accessible, using empty inventory for AI analysis");
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

  /**
   * AI Helper - DeepSeek R1 API Integration
   * Provides inventory management insights, trends, and general assistance
   */
  app.post("/api/ai-helper", async (req, res) => {
    try {
      const { query, context } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      // Get current inventory for context
      let medicines: any[] = [];
      try {
        medicines = await db.query.medicines.findMany();
      } catch (dbError) {
        console.log("Database not accessible for AI Helper");
      }

      const helperContext = {
        medicines: medicines,
        recentUsage: context?.recentUsage || [],
        trends: context?.trends || []
      };

      const result = await deepSeekAI.provideInventoryHelp(query, helperContext);
      res.json(result);
    } catch (error) {
      console.error("AI Helper error:", error);
      res.status(500).json({
        error: "Unable to process request",
        response: "I'm experiencing some difficulties. Please try again or check if the DeepSeek API is properly configured."
      });
    }
  });

  /**
   * Learning Assistant - DeepSeek R1 API Integration
   * Generates educational content and quiz questions
   */
  app.post("/api/learning-assistant", async (req, res) => {
    try {
      const { topic, difficulty, questionType } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const result = await deepSeekAI.generateLearningContent(
        topic, 
        difficulty || 'beginner',
        questionType || 'multiple_choice'
      );
      res.json(result);
    } catch (error) {
      console.error("Learning Assistant error:", error);
      res.status(500).json({
        error: "Unable to generate learning content",
        explanation: "Learning content generation is temporarily unavailable. Please ensure the DeepSeek API is properly configured."
      });
    }
  });

  /**
   * General Chatbot - DeepSeek R1 API Integration
   * Handles all conversational AI interactions
   */
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const result = await deepSeekAI.handleGeneralChat(message, context || {});
      res.json(result);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({
        error: "Unable to process chat message",
        response: "I'm having some technical difficulties. Please try again or ensure the AI service is properly configured."
      });
    }
  });

  /**
   * Family Management Endpoints
   */
  
  // Create a new family
  app.post("/api/family/create", async (req, res) => {
    try {
      const { memberName } = req.body;
      if (!memberName) {
        return res.status(400).json({ error: "Member name is required" });
      }

      const familyId = await familyInventoryService.createFamily(memberName);
      res.json({ familyId, message: "Family created successfully" });
    } catch (error) {
      console.error("Error creating family:", error);
      res.status(500).json({ error: "Failed to create family" });
    }
  });

  // Join existing family
  app.post("/api/family/join", async (req, res) => {
    try {
      const { familyId, memberName } = req.body;
      if (!familyId || !memberName) {
        return res.status(400).json({ error: "Family ID and member name are required" });
      }

      const success = await familyInventoryService.joinFamily(familyId, memberName);
      if (success) {
        res.json({ message: "Successfully joined family" });
      } else {
        res.status(404).json({ error: "Family not found" });
      }
    } catch (error) {
      console.error("Error joining family:", error);
      res.status(500).json({ error: "Failed to join family" });
    }
  });

  /**
   * Family Medicine Inventory Endpoints (Real-time synced)
   */
  
  // Get family medicines
  app.get("/api/family/:familyId/medicines", async (req, res) => {
    try {
      const { familyId } = req.params;
      const medicines = await familyInventoryService.getFamilyInventory(familyId);
      res.json(medicines);
    } catch (error) {
      console.error("Error fetching family medicines:", error);
      res.status(500).json({ error: "Failed to fetch family medicines" });
    }
  });

  // Add medicine to family inventory
  app.post("/api/family/:familyId/medicines", async (req, res) => {
    try {
      const { familyId } = req.params;
      const { updatedBy, ...medicineData } = req.body;
      
      if (!updatedBy) {
        return res.status(400).json({ error: "updatedBy field is required" });
      }

      const newMedicine = await familyInventoryService.addMedicine(
        familyId, 
        medicineData, 
        updatedBy
      );

      if (newMedicine) {
        res.status(201).json(newMedicine);
      } else {
        res.status(500).json({ error: "Failed to add medicine" });
      }
    } catch (error) {
      console.error("Error adding medicine to family:", error);
      res.status(500).json({ error: "Failed to add medicine to family inventory" });
    }
  });

  // Update medicine in family inventory
  app.put("/api/family/:familyId/medicines/:medicineId", async (req, res) => {
    try {
      const { familyId, medicineId } = req.params;
      const { updatedBy, ...updates } = req.body;
      
      if (!updatedBy) {
        return res.status(400).json({ error: "updatedBy field is required" });
      }

      const updatedMedicine = await familyInventoryService.updateMedicine(
        familyId, 
        parseInt(medicineId), 
        updates, 
        updatedBy
      );

      if (updatedMedicine) {
        res.json(updatedMedicine);
      } else {
        res.status(404).json({ error: "Medicine not found or access denied" });
      }
    } catch (error) {
      console.error("Error updating family medicine:", error);
      res.status(500).json({ error: "Failed to update medicine" });
    }
  });

  // Delete medicine from family inventory
  app.delete("/api/family/:familyId/medicines/:medicineId", async (req, res) => {
    try {
      const { familyId, medicineId } = req.params;
      const { updatedBy } = req.body;
      
      if (!updatedBy) {
        return res.status(400).json({ error: "updatedBy field is required" });
      }

      const success = await familyInventoryService.deleteMedicine(
        familyId, 
        parseInt(medicineId), 
        updatedBy
      );

      if (success) {
        res.json({ message: "Medicine deleted successfully" });
      } else {
        res.status(404).json({ error: "Medicine not found or access denied" });
      }
    } catch (error) {
      console.error("Error deleting family medicine:", error);
      res.status(500).json({ error: "Failed to delete medicine" });
    }
  });

  // Get family members info
  app.get("/api/family/:familyId/members", async (req, res) => {
    try {
      const { familyId } = req.params;
      const members = familyInventoryService.getFamilyMembers(familyId);
      const count = familyInventoryService.getFamilyMembersCount(familyId);
      
      res.json({ 
        members, 
        count,
        familyId 
      });
    } catch (error) {
      console.error("Error fetching family members:", error);
      res.status(500).json({ error: "Failed to fetch family members" });
    }
  });

  const server = createServer(app);
  
  // Setup WebSocket server for real-time family inventory sync
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'JOIN_FAMILY':
            const { familyId, memberId, memberName } = data;
            if (familyId && memberId) {
              familyInventoryService.addFamilyMember(ws, familyId, memberId, memberName);
              ws.send(JSON.stringify({
                type: 'FAMILY_JOINED',
                familyId,
                message: 'Successfully joined family inventory sync'
              }));
            }
            break;
            
          case 'PING':
            ws.send(JSON.stringify({ type: 'PONG' }));
            break;
            
          default:
            console.log('Unknown WebSocket message type:', data.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        ws.send(JSON.stringify({
          type: 'ERROR',
          message: 'Failed to process message'
        }));
      }
    });
    
    ws.on('close', () => {
      familyInventoryService.removeFamilyMember(ws);
      console.log('WebSocket connection closed');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      familyInventoryService.removeFamilyMember(ws);
    });
  });

  return server;
}