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
        
        // Generate unique ID using timestamp and random number to prevent duplicates
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        const newId = parseInt(`${timestamp}${random}`.slice(-10)); // Keep it as a reasonable number
        
        const newMedicine = {
          id: newId,
          ...medicine,
        };
        
        try {
          // Always save to local IndexedDB first for offline capability
          await db.medicines.add(newMedicine);
          
          // Update store state immediately
          set((currentState) => ({ 
            medicines: [...currentState.medicines, newMedicine],
            lastUpdated: new Date().toISOString(),
            syncStatus: 'synced'
          }));
          
          // If user is part of a family, sync to Firebase in background
          if (state.familyId && state.memberName && firebaseFamilyService.isConfigured()) {
            // Don't await Firebase sync to avoid blocking the UI
            firebaseFamilyService.addMedicine(
              medicine,
              state.familyId,
              state.memberName
            ).catch(firebaseError => {
              console.warn('Firebase sync failed, but medicine saved locally:', firebaseError);
            });
          }
          
          return { success: true };
          
        } catch (error) {
          console.error('Error adding medicine:', error);
          return { success: false };
        }
      },
      
      updateMedicine: async (id, medicine) => {
        const state = get();
        
        try {
          // Always update local IndexedDB first
          await db.medicines.update(id, medicine);
          
          // Update store state immediately
          set((currentState) => ({
            medicines: currentState.medicines.map(m => 
              m.id === id ? { ...m, ...medicine } : m
            ),
            lastUpdated: new Date().toISOString(),
            syncStatus: 'synced'
          }));
          
          // If user is part of a family, sync to Firebase in background
          if (state.familyId && state.memberName && firebaseFamilyService.isConfigured()) {
            firebaseFamilyService.updateMedicine(
              id.toString(),
              medicine,
              state.familyId,
              state.memberName
            ).catch(firebaseError => {
              console.warn('Firebase sync failed, but medicine updated locally:', firebaseError);
            });
          }
          
        } catch (error) {
          console.error('Error updating medicine:', error);
        }
      },
      
      deleteMedicine: async (id) => {
        const state = get();
        
        try {
          // Always delete from local IndexedDB first
          await db.medicines.delete(id);
          
          // Update store state immediately
          set((currentState) => ({
            medicines: currentState.medicines.filter(m => m.id !== id),
            lastUpdated: new Date().toISOString(),
            syncStatus: 'synced'
          }));
          
          // If user is part of a family, sync to Firebase in background
          if (state.familyId && state.memberName && firebaseFamilyService.isConfigured()) {
            firebaseFamilyService.deleteMedicine(
              id.toString(),
              state.familyId,
              state.memberName
            ).catch(firebaseError => {
              console.warn('Firebase sync failed, but medicine deleted locally:', firebaseError);
            });
          }
          
        } catch (error) {
          console.error('Error deleting medicine:', error);
        }
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
      onRehydrateStorage: () => {
        return async (state) => {
          if (state) {
            try {
              console.log("Store rehydrated");
              
              // Load medicines from IndexedDB
              await db.open();
              console.log("Database opened successfully");
              
              const medicines = await db.medicines.toArray();
              
              // Update store state with IndexedDB data
              if (medicines && medicines.length > 0) {
                state.setMedicines(medicines);
                console.log(`Loaded ${medicines.length} medicines from IndexedDB`);
              }
              
              // Initialize family sync if user is already part of a family
              if (state.familyId && state.memberName) {
                console.log("Auto-initializing family sync for:", state.familyId);
                try {
                  await state.initializeFamilySync(state.familyId, state.memberName);
                } catch (err) {
                  console.error("Failed to auto-initialize family sync:", err);
                }
              }
              
              // Clean up legacy sharing data
              localStorage.removeItem('saved-share-code');
              
            } catch (error) {
              console.error("Failed to load medicines from IndexedDB:", error);
            }
          }
        };
      }
    }
  )
);
