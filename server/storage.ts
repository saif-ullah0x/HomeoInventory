import { db } from "@db";
import { medicines } from "@shared/schema";
import { eq } from "drizzle-orm";

export const storage = {
  // Get all medicines
  getAllMedicines: async () => {
    return await db.query.medicines.findMany();
  },

  // Get medicine by ID
  getMedicineById: async (id: number) => {
    return await db.query.medicines.findFirst({
      where: eq(medicines.id, id),
    });
  },

  // Create a new medicine
  createMedicine: async (medicineData: any) => {
    const [medicine] = await db.insert(medicines).values(medicineData).returning();
    return medicine;
  },

  // Update a medicine
  updateMedicine: async (id: number, medicineData: any) => {
    const [updatedMedicine] = await db
      .update(medicines)
      .set(medicineData)
      .where(eq(medicines.id, id))
      .returning();
    return updatedMedicine;
  },

  // Delete a medicine
  deleteMedicine: async (id: number) => {
    const [deletedMedicine] = await db
      .delete(medicines)
      .where(eq(medicines.id, id))
      .returning();
    return deletedMedicine;
  },

  // Bulk insert medicines
  bulkInsertMedicines: async (medicinesData: any[]) => {
    return await db.insert(medicines).values(medicinesData).returning();
  },

  // Delete all medicines
  deleteAllMedicines: async () => {
    return await db.delete(medicines);
  }
};
