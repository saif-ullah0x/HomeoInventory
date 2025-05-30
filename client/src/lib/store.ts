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
  
  // Family inventory methods
  setFamilyInfo: (familyId: string, memberName: string, memberId?: string) => void;
  setMedicines: (medicines: Medicine[]) => void;
  clearFamily: () => void;
  initializeFamilySync: (familyId: string, memberName: string) => Promise<void>;
  loadFamilyInventory: (familyId: string) => Promise<void>;
  
  // Firebase real-time methods
  enableFirebaseSync: () => void;
  disableFirebaseSync: () => void;
  startFirebaseRealTimeSync: (familyId: string) => void;
  stopFirebaseRealTimeSync: () => void;
  
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
        
        // If user is part of a family, sync to cloud database
        if (state.familyId && state.memberName) {
          try {
            const response = await fetch(`/api/family/${state.familyId}/medicines`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...medicine,
                updatedBy: state.memberName
              })
            });
            
            if (response.ok) {
              const newMedicine = await response.json();
              
              // Update local state with the medicine from server (includes proper ID)
              set((currentState) => ({ 
                medicines: [...currentState.medicines, newMedicine],
                lastUpdated: new Date().toISOString(),
                syncStatus: 'synced'
              }));
              
              return { success: true };
            } else {
              throw new Error('Failed to add medicine to family inventory');
            }
          } catch (error) {
            console.error('Error adding medicine to family:', error);
            // Fall back to local storage if family sync fails
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
        
        // If user is part of a family, sync to family database
        if (state.familyId && state.memberName) {
          try {
            const response = await fetch(`/api/family/${state.familyId}/medicines/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...medicine,
                updatedBy: state.memberName
              })
            });
            
            if (response.ok) {
              const updatedMedicine = await response.json();
              
              // Update local state with the medicine from server
              set((currentState) => ({
                medicines: currentState.medicines.map(m => 
                  m.id === id ? updatedMedicine : m
                ),
                lastUpdated: new Date().toISOString(),
                syncStatus: 'synced'
              }));
              
              return;
            } else {
              throw new Error('Failed to update medicine in family inventory');
            }
          } catch (error) {
            console.error('Error updating medicine in family:', error);
            // Fall back to local storage if family sync fails
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
        
        // If user is part of a family, sync to family database
        if (state.familyId && state.memberName) {
          try {
            const response = await fetch(`/api/family/${state.familyId}/medicines/${id}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                updatedBy: state.memberName
              })
            });
            
            if (response.ok) {
              // Update local state by removing the medicine
              set((currentState) => ({
                medicines: currentState.medicines.filter(m => m.id !== id),
                lastUpdated: new Date().toISOString(),
                syncStatus: 'synced'
              }));
              
              return;
            } else {
              throw new Error('Failed to delete medicine from family inventory');
            }
          } catch (error) {
            console.error('Error deleting medicine from family:', error);
            // Fall back to local storage if family sync fails
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
        // Generate memberId if not provided
        const finalMemberId = memberId || Math.random().toString(36).substring(2, 10);
        set({ familyId, memberName, memberId: finalMemberId });
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
      },

      // Initialize WebSocket connection for real-time family sync
      initializeFamilySync: async (familyId, memberName) => {
        try {
          const memberId = Math.random().toString(36).substring(2, 10);
          
          // Update family info
          get().setFamilyInfo(familyId, memberName, memberId);
          
          // Connect to WebSocket for real-time sync
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const wsUrl = `${protocol}//${window.location.host}/ws`;
          
          const ws = new WebSocket(wsUrl);
          
          ws.onopen = () => {
            console.log('Connected to family sync WebSocket');
            // Join family for real-time updates
            ws.send(JSON.stringify({
              type: 'JOIN_FAMILY',
              familyId,
              memberId,
              memberName
            }));
          };
          
          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              
              switch (data.type) {
                case 'FULL_INVENTORY':
                  // Update local inventory with family data
                  get().setMedicines(data.data.medicines || []);
                  console.log('Family inventory synchronized');
                  break;
                  
                case 'INVENTORY_UPDATE':
                  // Handle real-time inventory updates
                  console.log('Inventory update received:', data.data);
                  // Reload family inventory to get latest data
                  get().loadFamilyInventory(familyId);
                  break;
                  
                case 'FAMILY_JOINED':
                  console.log('Successfully joined family inventory');
                  break;
                  
                default:
                  console.log('Unknown WebSocket message:', data);
              }
            } catch (error) {
              console.error('Error processing WebSocket message:', error);
            }
          };
          
          ws.onclose = () => {
            console.log('Family sync WebSocket disconnected');
            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
              if (get().familyId) {
                get().initializeFamilySync(get().familyId!, get().memberName!);
              }
            }, 5000);
          };
          
          ws.onerror = (error) => {
            console.error('WebSocket error:', error);
          };
          
        } catch (error) {
          console.error('Error initializing family sync:', error);
        }
      },

      loadFamilyInventory: async (familyId) => {
        try {
          const response = await fetch(`/api/family/${familyId}/medicines`);
          if (response.ok) {
            const medicines = await response.json();
            get().setMedicines(medicines);
            console.log(`Loaded ${medicines.length} medicines from family inventory`);
          } else {
            console.error('Failed to load family inventory');
          }
        } catch (error) {
          console.error('Error loading family inventory:', error);
        }
      },

      // Firebase real-time sync methods
      enableFirebaseSync: () => {
        set({ isFirebaseEnabled: true });
        console.log('Firebase real-time sync enabled');
      },

      disableFirebaseSync: () => {
        get().stopFirebaseRealTimeSync();
        set({ isFirebaseEnabled: false });
        console.log('Firebase real-time sync disabled');
      },

      startFirebaseRealTimeSync: (familyId) => {
        const state = get();
        if (!state.isFirebaseEnabled) {
          console.log('Firebase sync not enabled, skipping real-time sync');
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
            
            // Check for saved share code and load it if found (legacy support)
            const savedShareCode = localStorage.getItem('saved-share-code');
            if (savedShareCode && state.loadSharedMedicineDatabase && !state.familyId) {
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
