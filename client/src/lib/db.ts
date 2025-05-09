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

// Family sharing functions - Now using cloud API
export async function createSharedInventory(shareCode: string, medicines: Medicine[], name?: string): Promise<boolean> {
  try {
    // Store inventory in local database for offline access
    const localSharedInventory: SharedInventory = {
      shareCode,
      medicines,
      created: new Date(),
      name
    };
    
    await db.sharedInventories.add(localSharedInventory);
    
    // Also store in cloud database if online
    try {
      const response = await fetch('/api/shared-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicines,
          name: name || "My Medicine Inventory",
          isViewOnly: false
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Cloud inventory created with ID:', result.inventoryId);
        
        // Update the local record with the actual inventory ID from server
        if (result.inventoryId) {
          await db.sharedInventories
            .where('shareCode')
            .equals(shareCode)
            .modify({ shareCode: result.inventoryId });
        }
      }
    } catch (err) {
      console.warn('Failed to create cloud inventory, but local copy was saved:', err);
      // Continue with local storage only if cloud fails
    }
    
    return true;
  } catch (error) {
    console.error('Error creating shared inventory:', error);
    return false;
  }
}

export async function getSharedInventory(shareCode: string): Promise<SharedInventory | null> {
  try {
    // First try to get from the cloud
    try {
      const response = await fetch(`/api/shared-inventory/${shareCode}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          shareCode: data.inventoryId,
          medicines: data.medicines,
          created: new Date(data.createdAt),
          name: data.name
        };
      }
    } catch (err) {
      console.warn('Failed to fetch from cloud, trying local cache:', err);
    }
    
    // If cloud fails or returns no results, try local cache
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
    // Get the shared inventory (tries cloud first, then local)
    const shared = await getSharedInventory(shareCode);
    
    if (shared && shared.medicines && shared.medicines.length > 0) {
      // Clear current medicines
      await db.medicines.clear();
      
      // Add the shared medicines to local database
      await db.medicines.bulkAdd(shared.medicines);
      
      // Also store this shared inventory locally for offline access
      const existingLocal = await db.sharedInventories
        .where('shareCode')
        .equals(shareCode)
        .first();
      
      if (!existingLocal) {
        await db.sharedInventories.add({
          shareCode,
          medicines: shared.medicines,
          created: new Date(),
          name: shared.name
        });
      }
      
      return true;
    }
    
    // If we couldn't find the inventory, return false
    return false;
  } catch (error) {
    console.error('Error importing shared inventory:', error);
    return false;
  }
}
