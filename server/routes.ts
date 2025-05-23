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

// Enhanced AI Doctor using symptom-based medicine database from PDF
function analyzeSymptoms(symptoms: string, userInventory: string[]) {
  // Use the structured symptom-medicine database from PDF
  const medicineGuides = searchMedicinesBySymptoms(symptoms);
  
  if (medicineGuides.length === 0) {
    return {
      response: "I'd like to help you find the right remedy! 💜 Could you describe your symptoms in a bit more detail? For example, mention when you feel worse or better, or what triggered the symptoms.",
      remedies: []
    };
  }

  // Get motivational message
  const motivationalMsg = getSimpleMotivationalMessage(symptoms);
  
  // Use the first matched guide for response
  const primaryGuide = medicineGuides[0];
  
  const response = `${motivationalMsg}\n\nBased on classical homeopathic guidance, here are the recommended medicines for "${primaryGuide.condition}":\n\n**Dosage:** ${primaryGuide.dosage}\n**Frequency:** ${primaryGuide.frequency}`;
  
  // Convert medicine recommendations to our format
  const remedies = primaryGuide.medicines.map(med => ({
    name: med.name,
    potency: med.potency,
    indication: primaryGuide.condition,
    reasoning: `${med.drops} drops - ${primaryGuide.notes || 'As per classical guidance'}`,
    source: med.company || "Classical Homeopathic Literature",
    inInventory: userInventory.some(inv => 
      inv.toLowerCase().includes(med.name.toLowerCase()) ||
      med.name.toLowerCase().includes(inv.toLowerCase())
    )
  }));

  return { response, remedies };
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

  // AI DOCTOR ENDPOINT
  app.post(`${apiPrefix}/ai-doctor`, async (req, res) => {
    try {
      const { symptoms, userInventory } = req.body;

      if (!symptoms || typeof symptoms !== 'string') {
        return res.status(400).json({ error: "Symptoms are required" });
      }

      const aiResponse = analyzeSymptoms(symptoms, userInventory || []);
      
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

  const httpServer = createServer(app);
  return httpServer;
}
