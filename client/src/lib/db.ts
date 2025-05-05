import Dexie, { Table } from 'dexie';
import { Medicine } from '@/lib/store';

// IndexedDB database class
class HomeoDatabase extends Dexie {
  medicines!: Table<Medicine, number>;

  constructor() {
    super('homeoInventoryDB');
    this.version(1).stores({
      medicines: '++id, name, company, location'
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
