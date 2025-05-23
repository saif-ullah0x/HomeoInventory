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

// Homeopathic Knowledge Base - Based on Classical Materia Medica
function analyzeSymptoms(symptoms: string, userInventory: string[]) {
  const symptomsLower = symptoms.toLowerCase();
  const remedies: any[] = [];
  
  // Classical remedy database based on Boericke, Kent, and Clarke's Materia Medica
  const materiamedica = [
    {
      name: "Aconitum Napellus",
      potency: "30C",
      keywords: ["sudden", "anxiety", "fear", "restless", "thirst", "fever", "shock", "panic"],
      indication: "Sudden onset of acute conditions with great anxiety and restlessness",
      reasoning: "Indicated in sudden, violent complaints that come on from exposure to dry cold winds or from fright",
      source: "Boericke's Materia Medica"
    },
    {
      name: "Arsenicum Album",
      potency: "30C",
      keywords: ["anxiety", "restless", "thirst", "burning", "weakness", "fear", "midnight", "cold"],
      indication: "Great anxiety and restlessness with burning pains and thirst for small quantities",
      reasoning: "The restlessness of Arsenicum is marked by anguish and desire to move from place to place",
      source: "Kent's Materia Medica"
    },
    {
      name: "Belladonna",
      potency: "30C",
      keywords: ["headache", "sudden", "throbbing", "hot", "red", "fever", "violent", "intense"],
      indication: "Sudden, violent headaches with throbbing and heat",
      reasoning: "Headaches that come on suddenly with great violence, heat, and redness",
      source: "Boericke's Materia Medica"
    },
    {
      name: "Bryonia Alba",
      potency: "30C",
      keywords: ["headache", "worse motion", "thirst", "dry", "irritable", "wants quiet"],
      indication: "Headaches worse from motion, better from pressure and rest",
      reasoning: "The great characteristic is aggravation from any motion and amelioration from rest",
      source: "Kent's Materia Medica"
    },
    {
      name: "Gelsemium",
      potency: "30C",
      keywords: ["dizzy", "dizziness", "weakness", "drowsy", "fear", "anxiety", "trembling"],
      indication: "Dizziness with weakness, drowsiness and trembling from fear",
      reasoning: "Great remedy for weakness and trembling from emotional excitement",
      source: "Clarke's Materia Medica"
    },
    {
      name: "Nux Vomica",
      potency: "30C",
      keywords: ["irritable", "anger", "digestive", "nausea", "headache", "oversensitive"],
      indication: "Digestive complaints with great irritability and oversensitiveness",
      reasoning: "The typical Nux patient is very irritable, oversensitive to noise, odors, and light",
      source: "Boericke's Materia Medica"
    },
    {
      name: "Pulsatilla",
      potency: "30C",
      keywords: ["changeable", "mild", "weepy", "better open air", "thirstless", "gentle"],
      indication: "Changeable symptoms in mild, gentle patients who crave open air",
      reasoning: "Symptoms are changeable, no two attacks alike, better in open air",
      source: "Kent's Materia Medica"
    },
    {
      name: "Rhus Toxicodendron",
      potency: "30C",
      keywords: ["restless", "stiff", "better motion", "worse rest", "joint", "muscle"],
      indication: "Restlessness with stiffness, better from continued motion",
      reasoning: "The restlessness is marked - cannot remain in any position long",
      source: "Boericke's Materia Medica"
    },
    {
      name: "Sulphur",
      potency: "30C",
      keywords: ["burning", "itching", "worse heat", "dirty", "untidy", "philosophical"],
      indication: "Burning sensations, worse from heat, in untidy patients",
      reasoning: "The great anti-psoric remedy with characteristic burning sensations",
      source: "Kent's Materia Medica"
    },
    {
      name: "Ignatia",
      potency: "30C",
      keywords: ["grief", "emotional", "contradictory", "sighing", "mood", "hysteria"],
      indication: "Emotional disturbances with contradictory and changeable symptoms",
      reasoning: "The remedy of contradictions - symptoms appear contradictory and unexpected",
      source: "Clarke's Materia Medica"
    }
  ];
  
  // Analyze symptoms and match with remedies
  for (const remedy of materiamedica) {
    let matchScore = 0;
    const matchedKeywords: string[] = [];
    
    for (const keyword of remedy.keywords) {
      if (symptomsLower.includes(keyword)) {
        matchScore++;
        matchedKeywords.push(keyword);
      }
    }
    
    // If we have matches, include the remedy
    if (matchScore > 0) {
      remedies.push({
        ...remedy,
        matchScore,
        matchedKeywords,
        inInventory: userInventory.some(inv => 
          inv.toLowerCase().includes(remedy.name.toLowerCase()) ||
          remedy.name.toLowerCase().includes(inv.toLowerCase())
        )
      });
    }
  }
  
  // Sort by match score and take top 3
  const topRemedies = remedies
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
    .map(remedy => ({
      name: remedy.name,
      potency: remedy.potency,
      indication: remedy.indication,
      reasoning: remedy.reasoning,
      source: remedy.source,
      inInventory: remedy.inInventory
    }));
  
  let response = "";
  
  if (topRemedies.length > 0) {
    response = `Based on the symptoms you've described, here are some homeopathic remedies from classical materia medica that may be helpful:\n\nThese suggestions are based on traditional homeopathic literature and symptom matching. Please consult with a qualified homeopathic practitioner for personalized treatment.`;
  } else {
    response = `I couldn't find specific remedy matches for those symptoms in my classical materia medica database. This doesn't mean homeopathy can't help - I recommend consulting with a qualified homeopathic practitioner who can conduct a more detailed case analysis.\n\nYou might also try describing your symptoms with more specific details about what makes them better or worse, timing, and associated feelings.`;
  }
  
  return {
    response,
    remedies: topRemedies
  };
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

      // For now, provide a structured response based on homeopathic principles
      // This will be enhanced with actual AI integration when API key is provided
      const mockResponse = analyzeSymptoms(symptoms, userInventory || []);
      
      return res.json(mockResponse);
    } catch (error) {
      console.error("Error in AI Doctor endpoint:", error);
      return res.status(500).json({ error: "Failed to analyze symptoms" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
