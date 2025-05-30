import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, createSharedInventory, importSharedInventory } from '@/lib/db';
import { firebaseFamilyService } from '@/lib/firebase-family-service';

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
  isFirebaseEnabled: boolean;
  
  // Actions
  addMedicine: (medicine: MedicineInput) => Promise<{ success: boolean; duplicate?: Medicine }>;
  updateMedicine: (id: number, medicine: MedicineInput) => Promise<void>;
  deleteMedicine: (id: number) => Promise<void>;
  getMedicineById: (id: number) => Medicine | undefined;
  findDuplicateMedicine: (medicine: MedicineInput) => Medicine | undefined;
  getUniqueLocations: () => string[];
  getUniqueCompanies: () => string[];
  exportData: () => { medicines: Medicine[], exportDate: string };
  
  // Firebase Family Sharing Methods (Real-time sync only)
  setFamilyId: (familyId: string) => void;
  setMemberName: (memberName: string) => void;
  setMedicines: (medicines: Medicine[]) => void;
  clearFamily: () => void;
  initializeFamilySync: (familyId: string, memberName: string) => Promise<void>;
  loadFamilyInventory: (familyId: string) => Promise<void>;
  startFirebaseRealTimeSync: (familyId: string) => void;
  stopFirebaseRealTimeSync: () => void;
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
      isFirebaseEnabled: false,
      
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
        
        const state = get();
        
        // If user is part of a family, sync to Firebase
        if (state.familyId && state.memberName) {
          try {
            // Add medicine to Firebase Firestore for real-time sync
            const firebaseMedicine = await firebaseFamilyService.addMedicine(
              medicine,
              state.familyId,
              state.memberName
            );
            
            if (firebaseMedicine) {
              // Firebase real-time listener will update the store automatically
              // Just return success here
              return { success: true };
            } else {
              throw new Error('Failed to add medicine to Firebase family inventory');
            }
          } catch (error) {
            console.error('Error adding medicine to Firebase family:', error);
            // Fall back to local storage if Firebase sync fails
          }
        }
        
        // Local storage fallback (for non-family users or when sync fails)
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
        
        // Save to IndexedDB for local users
        await db.medicines.add(newMedicine);
        
        return { success: true };
      },
      
      updateMedicine: async (id, medicine) => {
        const state = get();
        
        // If user is part of a family, sync to Firebase
        if (state.familyId && state.memberName) {
          try {
            // Update medicine in Firebase Firestore for real-time sync
            const success = await firebaseFamilyService.updateMedicine(
              id.toString(),
              medicine,
              state.familyId,
              state.memberName
            );
            
            if (success) {
              // Firebase real-time listener will update the store automatically
              return;
            } else {
              throw new Error('Failed to update medicine in Firebase family inventory');
            }
          } catch (error) {
            console.error('Error updating medicine in Firebase family:', error);
            // Fall back to local storage if Firebase sync fails
          }
        }
        
        // Local storage fallback (for non-family users or when sync fails)
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
      
      deleteMedicine: async (id) => {
        const state = get();
        
        // If user is part of a family, sync to Firebase
        if (state.familyId && state.memberName) {
          try {
            // Delete medicine from Firebase Firestore for real-time sync
            const success = await firebaseFamilyService.deleteMedicine(
              id.toString(),
              state.familyId,
              state.memberName
            );
            
            if (success) {
              // Firebase real-time listener will update the store automatically
              return;
            } else {
              throw new Error('Failed to delete medicine from Firebase family inventory');
            }
          } catch (error) {
            console.error('Error deleting medicine from Firebase family:', error);
            // Fall back to local storage if Firebase sync fails
          }
        }
        
        // Local storage fallback (for non-family users or when sync fails)
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
      


      // Firebase Family Sharing Methods
      setFamilyId: (familyId: string) => {
        set({ familyId });
      },

      setMemberName: (memberName: string) => {
        set({ memberName });
      },

      setMedicines: (medicines: Medicine[]) => {
        set({ 
          medicines, 
          lastUpdated: new Date().toISOString(),
          syncStatus: 'synced'
        });
      },

      clearFamily: () => {
        // Stop Firebase sync first
        firebaseFamilyService.cleanup();
        
        set({ 
          familyId: null, 
          memberName: null, 
          memberId: null,
          isFirebaseEnabled: false,
          medicines: [] 
        });
      },

      // Initialize Firebase real-time sync for family inventory
      initializeFamilySync: async (familyId: string, memberName: string) => {
        try {
          const memberId = `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Update family info
          set({ familyId, memberName, memberId, isFirebaseEnabled: true });
          
          // Start Firebase real-time sync immediately
          get().startFirebaseRealTimeSync(familyId);
          
          console.log('Firebase family sync initialized for:', familyId);
        } catch (error) {
          console.error('Error initializing Firebase family sync:', error);
        }
      },

      loadFamilyInventory: async (familyId: string) => {
        try {
          // Firebase real-time sync will automatically load the inventory
          // This method is kept for compatibility but Firebase handles loading
          console.log('Loading family inventory from Firebase:', familyId);
        } catch (error) {
          console.error('Error loading family inventory:', error);
        }
      },

      startFirebaseRealTimeSync: (familyId: string) => {
        const state = get();
        
        // Check if Firebase is configured
        if (!firebaseFamilyService.isConfigured()) {
          console.warn('Firebase not configured, real-time sync disabled');
          return;
        }

        // Start Firebase real-time listener for family inventory
        firebaseFamilyService.startInventorySync(familyId, (medicines) => {
          console.log(`Firebase real-time update: ${medicines.length} medicines received`);
          set({
            medicines,
            lastUpdated: new Date().toISOString(),
            syncStatus: 'synced'
          });
        });
      },

      stopFirebaseRealTimeSync: () => {
        firebaseFamilyService.stopInventorySync();
        console.log('Stopped Firebase real-time sync');
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
            
            // Initialize family sync if user is already part of a family
            if (state.familyId && state.memberName) {
              console.log("Auto-initializing family sync for:", state.familyId);
              try {
                await state.initializeFamilySync(state.familyId, state.memberName);
                await state.loadFamilyInventory(state.familyId);
              } catch (err) {
                console.error("Failed to auto-initialize family sync:", err);
              }
            }
            
            // Clean up legacy sharing data (remove old local sharing)
            localStorage.removeItem('saved-share-code');
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
