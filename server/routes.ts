import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { InsertMedicine, Medicine, medicines } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "@db";

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

  const httpServer = createServer(app);
  return httpServer;
}
