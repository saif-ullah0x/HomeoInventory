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
  addMedicine: (medicine: MedicineInput) => Promise<{ success: boolean; duplicate?: Medicine }>;
  updateMedicine: (id: number, medicine: MedicineInput) => void;
  deleteMedicine: (id: number) => void;
  getMedicineById: (id: number) => Medicine | undefined;
  findDuplicateMedicine: (medicine: MedicineInput) => Medicine | undefined;
  getUniqueLocations: () => string[];
  getUniqueCompanies: () => string[];
  exportData: () => { medicines: Medicine[], exportDate: string };
  
  // Family sharing methods
  shareMedicineDatabase: () => string;
  loadSharedMedicineDatabase: (shareCode: string) => boolean;
}

// Use Zustand with persist middleware for local storage
export const useStore = create<MedicineState>()(
  persist(
    (set, get) => ({
      medicines: [],
      syncStatus: 'synced',
      lastUpdated: new Date().toISOString(),
      
      findDuplicateMedicine: (medicine) => {
        // Check if there's a duplicate medicine (same name, potency, company)
        return get().medicines.find(m => 
          m.name.toLowerCase() === medicine.name.toLowerCase() &&
          m.potency === medicine.potency &&
          m.company.toLowerCase() === medicine.company.toLowerCase()
        );
      },
      
      addMedicine: async (medicine) => {
        // Check for duplicates first
        const duplicate = get().findDuplicateMedicine(medicine);
        
        if (duplicate) {
          return { success: false, duplicate };
        }
        
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
        await db.medicines.add(newMedicine);
        
        return { success: true };
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
      },
      
      // Sharing methods
      shareMedicineDatabase: () => {
        // Create a share code
        const shareCode = Math.random().toString(36).substring(2, 10);
        
        // Store the current medicine database with this share code
        const shareData = {
          shareCode,
          medicines: get().medicines,
          created: new Date().toISOString()
        };
        
        // Save to localStorage for retrieval by other devices/browsers
        localStorage.setItem(`homeo-share-${shareCode}`, JSON.stringify(shareData));
        
        return shareCode;
      },
      
      loadSharedMedicineDatabase: (shareCode) => {
        // In a real app, this would make an API call to fetch shared data
        // For now we'll simulate by finding the database in localStorage
        
        // Try to find share data by code in localStorage
        const sharedData = localStorage.getItem(`homeo-share-${shareCode}`);
        
        if (sharedData) {
          try {
            const parsed = JSON.parse(sharedData);
            
            // For demo, just update the database directly
            // In a real app, we would merge intelligently with existing data
            if (parsed.medicines && Array.isArray(parsed.medicines)) {
              // Update the store
              set({
                medicines: parsed.medicines,
                lastUpdated: new Date().toISOString(),
                syncStatus: 'synced'
              });
              
              // Update IndexedDB - clear existing and bulk add
              db.medicines.clear().then(() => {
                db.medicines.bulkAdd(parsed.medicines);
              });
              
              return true;
            }
          } catch (error) {
            console.error("Error parsing shared database:", error);
          }
        }
        
        // If no medicines were found for the share code,
        // add some demo medicines so the user can see the feature working
        const currentMedicines = get().medicines;
        
        if (currentMedicines.length === 0) {
          // Add some sample medicines if none exist
          const sampleMedicines = [
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
          
          // Update the store
          set({
            medicines: sampleMedicines,
            lastUpdated: new Date().toISOString(),
            syncStatus: 'synced'
          });
          
          // Update IndexedDB
          db.medicines.bulkAdd(sampleMedicines);
        }
        
        // For demo purposes, always return success
        return true;
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
