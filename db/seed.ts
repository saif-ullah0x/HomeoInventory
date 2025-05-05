import { db } from "./index";
import * as schema from "@shared/schema";

// Default medicine data
const seedMedicines = [
  {
    name: "Arnica Montana",
    potency: "30C",
    company: "Masood",
    location: "Home",
    subLocation: "Medicine Cabinet",
    quantity: 2
  },
  {
    name: "Belladonna",
    potency: "200C",
    company: "Kent",
    location: "Home",
    subLocation: "Drawer",
    quantity: 1
  },
  {
    name: "Nux Vomica",
    potency: "30C",
    company: "BM",
    location: "Home",
    subLocation: "Medicine Cabinet",
    quantity: 0
  },
  {
    name: "Aconitum Napellus",
    potency: "30C",
    company: "Masood",
    location: "Travel Kit",
    subLocation: null,
    quantity: 1
  },
  {
    name: "Bryonia Alba",
    potency: "200C",
    company: "SBL",
    location: "Office",
    subLocation: "Desk Drawer",
    quantity: 1
  },
  {
    name: "Rhus Toxicodendron",
    potency: "6C",
    company: "Schwabe",
    location: "Home",
    subLocation: "Medicine Cabinet",
    quantity: 3
  },
  {
    name: "Pulsatilla",
    potency: "30C",
    company: "BM",
    location: "First Aid Kit",
    subLocation: null,
    quantity: 1
  }
];

async function seed() {
  try {
    // Check if medicines table is empty
    const existingMedicines = await db.query.medicines.findMany({
      limit: 1,
    });

    if (existingMedicines.length === 0) {
      console.log("Seeding medicines table with initial data...");
      
      // Insert seed medicines
      await db.insert(schema.medicines).values(seedMedicines);
      
      console.log("Successfully seeded medicines table.");
    } else {
      console.log("Medicines table already contains data, skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
