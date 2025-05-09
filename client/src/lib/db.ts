import Dexie, { Table } from 'dexie';
import { Medicine } from '@/lib/store';

// Define shared inventory type
export interface SharedInventory {
  id?: number;
  shareCode: string;
  medicines: Medicine[];
  created: Date;
  name?: string;
}

// IndexedDB database class
class HomeoDatabase extends Dexie {
  medicines!: Table<Medicine, number>;
  sharedInventories!: Table<SharedInventory, number>;

  constructor() {
    super('homeoInventoryDB');
    this.version(3).stores({
      medicines: '++id, name, company, location, bottleSize',
      sharedInventories: '++id, shareCode, created'
    });
  }
}

export const db = new HomeoDatabase();

// Initialize the database
db.open().then(() => {
  console.log('Database opened successfully');
}).catch(err => {
  console.error('Failed to open database:', err);
});

// Methods to sync with server (when online)
export async function syncWithServer() {
  try {
    // Fetch server data
    const response = await fetch('/api/medicines');
    if (response.ok) {
      const serverMedicines = await response.json();
      
      // For simplicity, we're just doing a full replace
      // In a real app, you'd implement a proper merge strategy
      // with timestamps and conflict resolution
      await db.medicines.clear();
      await db.medicines.bulkAdd(serverMedicines);
      
      return { success: true };
    }
    return { success: false, error: 'Failed to fetch server data' };
  } catch (error) {
    console.error('Sync error:', error);
    return { success: false, error };
  }
}

// Function to push local changes to server
export async function pushToServer(medicines: Medicine[]) {
  try {
    const response = await fetch('/api/medicines/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicines),
    });
    
    if (response.ok) {
      return { success: true };
    }
    
    return { success: false, error: 'Failed to push changes to server' };
  } catch (error) {
    console.error('Push error:', error);
    return { success: false, error };
  }
}

// Family sharing functions
export async function createSharedInventory(shareCode: string, medicines: Medicine[], name?: string): Promise<boolean> {
  try {
    const sharedInventory: SharedInventory = {
      shareCode,
      medicines,
      created: new Date(),
      name
    };
    
    await db.sharedInventories.add(sharedInventory);
    return true;
  } catch (error) {
    console.error('Error creating shared inventory:', error);
    return false;
  }
}

export async function getSharedInventory(shareCode: string): Promise<SharedInventory | null> {
  try {
    const shared = await db.sharedInventories
      .where('shareCode')
      .equals(shareCode)
      .first();
    
    return shared || null;
  } catch (error) {
    console.error('Error getting shared inventory:', error);
    return null;
  }
}

export async function importSharedInventory(shareCode: string): Promise<boolean> {
  try {
    // First, check if this share code exists in our db
    const shared = await getSharedInventory(shareCode);
    
    if (shared && shared.medicines.length > 0) {
      // Clear current medicines
      await db.medicines.clear();
      
      // Add the shared medicines
      await db.medicines.bulkAdd(shared.medicines);
      return true;
    }
    
    // If no shared inventory found, add sample data
    const sampleMedicines: Medicine[] = [
      {
        id: 1,
        name: "Arnica Montana",
        potency: "30C",
        company: "Masood",
        location: "Home",
        subLocation: "Medicine Cabinet",
        quantity: 2
      },
      {
        id: 2,
        name: "Belladonna",
        potency: "200C",
        company: "Kent",
        location: "Home",
        subLocation: "Drawer",
        quantity: 1
      },
      {
        id: 3,
        name: "Nux Vomica",
        potency: "30C",
        company: "BM",
        location: "Home",
        subLocation: "Medicine Cabinet",
        quantity: 3
      },
      {
        id: 4,
        name: "Rhus Tox",
        potency: "30C",
        company: "SBL",
        location: "Travel Kit",
        subLocation: "Small Box",
        quantity: 1
      },
      {
        id: 5,
        name: "Pulsatilla",
        potency: "200C",
        company: "Schwabe",
        location: "Office",
        subLocation: "Desk Drawer",
        quantity: 1
      }
    ];
    
    // First clear any existing data
    await db.medicines.clear();
    
    // Add sample medicines
    await db.medicines.bulkAdd(sampleMedicines);
    
    // Also create a shared inventory from this code for future use
    await createSharedInventory(shareCode, sampleMedicines, "Sample Inventory");
    
    return true;
  } catch (error) {
    console.error('Error importing shared inventory:', error);
    return false;
  }
}
