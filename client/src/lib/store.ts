import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/lib/db';

export interface Medicine {
  id: number;
  name: string;
  potency: string;
  company: string;
  location: string;
  subLocation?: string;
  quantity: number;
  bottleSize?: string;
}

interface MedicineInput {
  name: string;
  potency: string;
  company: string;
  location: string;
  subLocation?: string;
  quantity: number;
  bottleSize?: string;
}

interface MedicineState {
  medicines: Medicine[];
  syncStatus: 'synced' | 'unsaved' | 'error';
  lastUpdated: string;
  
  // Actions
  addMedicine: (medicine: MedicineInput) => void;
  updateMedicine: (id: number, medicine: MedicineInput) => void;
  deleteMedicine: (id: number) => void;
  getMedicineById: (id: number) => Medicine | undefined;
  getUniqueLocations: () => string[];
  getUniqueCompanies: () => string[];
  exportData: () => { medicines: Medicine[], exportDate: string };
}

// Use Zustand with persist middleware for local storage
export const useStore = create<MedicineState>()(
  persist(
    (set, get) => ({
      medicines: [],
      syncStatus: 'synced',
      lastUpdated: new Date().toISOString(),
      
      addMedicine: (medicine) => {
        const newId = get().medicines.length > 0 
          ? Math.max(...get().medicines.map(m => m.id)) + 1 
          : 1;
        
        const newMedicine = {
          id: newId,
          ...medicine,
        };
        
        set((state) => ({ 
          medicines: [...state.medicines, newMedicine],
          lastUpdated: new Date().toISOString(),
          syncStatus: 'unsaved'
        }));
        
        // Save to IndexedDB
        db.medicines.add(newMedicine);
      },
      
      updateMedicine: (id, medicine) => {
        set((state) => {
          const updatedMedicines = state.medicines.map(m => 
            m.id === id ? { ...m, ...medicine } : m
          );
          
          // Update in IndexedDB
          db.medicines.update(id, medicine);
          
          return {
            medicines: updatedMedicines,
            lastUpdated: new Date().toISOString(),
            syncStatus: 'unsaved'
          };
        });
      },
      
      deleteMedicine: (id) => {
        set((state) => {
          // Delete from IndexedDB
          db.medicines.delete(id);
          
          return {
            medicines: state.medicines.filter(m => m.id !== id),
            lastUpdated: new Date().toISOString(),
            syncStatus: 'unsaved'
          };
        });
      },
      
      getMedicineById: (id) => {
        return get().medicines.find(m => m.id === id);
      },
      
      getUniqueLocations: () => {
        // Use Array.from instead of spread operator for better compatibility
        return Array.from(new Set(get().medicines.map(m => m.location)));
      },
      
      getUniqueCompanies: () => {
        // Use Array.from instead of spread operator for better compatibility
        return Array.from(new Set(get().medicines.map(m => m.company)));
      },
      
      exportData: () => {
        return {
          medicines: get().medicines,
          exportDate: new Date().toISOString()
        };
      }
    }),
    {
      name: 'homeo-inventory',
      
      // Load existing data from IndexedDB when initializing from localStorage
      onRehydrateStorage: (state) => {
        // After the store has rehydrated from localStorage
        if (state) {
          // Attempt to get medicines from IndexedDB
          db.open().then(() => {
            return db.medicines.toArray();
          }).then((medicines) => {
            // If IndexedDB has medicines, update the store state
            if (medicines && medicines.length > 0) {
              state.medicines = medicines;
            }
          }).catch(error => {
            console.error("Failed to load medicines from IndexedDB:", error);
          });
        }
        
        // Return the updated state function
        return (newState) => {
          console.log("Store rehydrated");
        };
      }
    }
  )
);
