import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, createSharedInventory, importSharedInventory } from '@/lib/db';

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
  
  // Family information
  familyId: string | null;
  memberName: string | null;
  memberId: string | null;
  
  // Actions
  addMedicine: (medicine: MedicineInput) => Promise<{ success: boolean; duplicate?: Medicine }>;
  updateMedicine: (id: number, medicine: MedicineInput) => void;
  deleteMedicine: (id: number) => void;
  getMedicineById: (id: number) => Medicine | undefined;
  findDuplicateMedicine: (medicine: MedicineInput) => Medicine | undefined;
  getUniqueLocations: () => string[];
  getUniqueCompanies: () => string[];
  exportData: () => { medicines: Medicine[], exportDate: string };
  
  // Family inventory methods
  setFamilyInfo: (familyId: string, memberName: string, memberId: string) => void;
  setMedicines: (medicines: Medicine[]) => void;
  clearFamily: () => void;
  
  // Legacy sharing methods (kept for compatibility)
  shareMedicineDatabase: () => string;
  loadSharedMedicineDatabase: (shareCode: string) => Promise<boolean>;
}

// Use Zustand with persist middleware for local storage
export const useStore = create<MedicineState>()(
  persist(
    (set, get) => ({
      medicines: [],
      syncStatus: 'synced',
      lastUpdated: new Date().toISOString(),
      
      // Family information
      familyId: null,
      memberName: null,
      memberId: null,
      
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
        
        // Get current medicines
        const medicines = get().medicines;
        
        // Store the current medicine database with this share code in IndexedDB
        createSharedInventory(shareCode, medicines);
        
        return shareCode;
      },
      
      loadSharedMedicineDatabase: async (shareCode) => {
        try {
          // Use our shared inventory function to load data
          const success = await importSharedInventory(shareCode);
          
          if (success) {
            // Get the latest medicines from IndexedDB after importing
            const medicines = await db.medicines.toArray();
            
            // Update the store state
            set({
              medicines,
              lastUpdated: new Date().toISOString(),
              syncStatus: 'synced'
            });
            
            // Save the share code for persistent access
            localStorage.setItem('saved-share-code', shareCode);
            
            return true;
          }
        } catch (error) {
          console.error("Error loading shared inventory:", error);
        }
        
        return false;
      },

      // Family inventory methods
      setFamilyInfo: (familyId, memberName, memberId) => {
        set({ familyId, memberName, memberId });
      },

      setMedicines: (medicines) => {
        set({ 
          medicines, 
          lastUpdated: new Date().toISOString(),
          syncStatus: 'synced'
        });
      },

      clearFamily: () => {
        set({ 
          familyId: null, 
          memberName: null, 
          memberId: null,
          medicines: [] 
        });
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
            console.log("Database opened successfully");
            return db.medicines.toArray();
          }).then(async (medicines) => {
            // If IndexedDB has medicines, update the store state
            if (medicines && medicines.length > 0) {
              state.medicines = medicines;
            }
            
            // Check for saved share code and load it if found
            const savedShareCode = localStorage.getItem('saved-share-code');
            if (savedShareCode && state.loadSharedMedicineDatabase) {
              console.log("Auto-loading shared inventory with code:", savedShareCode);
              try {
                // Attempt to load the saved shared inventory
                await state.loadSharedMedicineDatabase(savedShareCode);
              } catch (err) {
                console.error("Failed to auto-load shared inventory:", err);
              }
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
