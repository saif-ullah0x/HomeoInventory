/**
 * Firebase Firestore Family Inventory Service
 * Handles real-time synchronization of family inventory using Firebase Firestore
 * 
 * This service provides real-time updates using Firebase's onSnapshot listeners
 * All family members see changes instantly, similar to Google Docs collaboration
 */

import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  setDoc,
  getDoc,
  Timestamp,
  type Unsubscribe
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase-config';
import type { Medicine } from './store';

export interface FirebaseMedicine {
  id?: string;
  name: string;
  potency: string;
  company: string;
  location: string;
  subLocation?: string;
  quantity: number;
  bottleSize?: string;
  familyId: string;
  addedBy: string;
  lastUpdated: Timestamp;
  updatedBy: string;
}

export interface FirebaseFamily {
  id?: string;
  familyId: string;
  createdBy: string;
  createdAt: Timestamp;
  memberCount: number;
  lastActivity: Timestamp;
}

export interface FirebaseFamilyMember {
  id?: string;
  familyId: string;
  memberName: string;
  memberId: string;
  joinedAt: Timestamp;
  lastSeen: Timestamp;
}

class FirebaseFamilyService {
  private medicinesUnsubscribe: Unsubscribe | null = null;
  private membersUnsubscribe: Unsubscribe | null = null;

  /**
   * Check if Firebase is properly configured
   */
  isConfigured(): boolean {
    return isFirebaseConfigured();
  }

  /**
   * Create a new family in Firestore
   */
  async createFamily(familyId: string, createdBy: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Firebase not configured, skipping Firestore family creation');
      return false;
    }

    try {
      const familyDoc = doc(db, 'families', familyId);
      await setDoc(familyDoc, {
        familyId,
        createdBy,
        createdAt: Timestamp.now(),
        memberCount: 1,
        lastActivity: Timestamp.now()
      });

      // Add creator as first member
      await this.addFamilyMember(familyId, createdBy, `member-${Date.now()}`);
      
      console.log('Family created in Firestore:', familyId);
      return true;
    } catch (error) {
      console.error('Error creating family in Firestore:', error);
      return false;
    }
  }

  /**
   * Join an existing family
   */
  async joinFamily(familyId: string, memberName: string, memberId: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Firebase not configured, skipping Firestore family join');
      return false;
    }

    try {
      // Check if family exists
      const familyDoc = doc(db, 'families', familyId);
      const familySnap = await getDoc(familyDoc);
      
      if (!familySnap.exists()) {
        console.error('Family not found in Firestore:', familyId);
        return false;
      }

      // Add member to family
      await this.addFamilyMember(familyId, memberName, memberId);
      
      // Update family member count
      const currentData = familySnap.data() as FirebaseFamily;
      await updateDoc(familyDoc, {
        memberCount: (currentData.memberCount || 0) + 1,
        lastActivity: Timestamp.now()
      });

      console.log('Successfully joined family in Firestore:', familyId);
      return true;
    } catch (error) {
      console.error('Error joining family in Firestore:', error);
      return false;
    }
  }

  /**
   * Add a family member to Firestore
   */
  private async addFamilyMember(familyId: string, memberName: string, memberId: string): Promise<void> {
    const membersCollection = collection(db, 'family_members');
    await addDoc(membersCollection, {
      familyId,
      memberName,
      memberId,
      joinedAt: Timestamp.now(),
      lastSeen: Timestamp.now()
    });
  }

  /**
   * Start listening to family inventory changes in real-time
   * Uses Firebase onSnapshot for instant updates across all family members
   */
  startInventorySync(familyId: string, onUpdate: (medicines: Medicine[]) => void): void {
    if (!this.isConfigured()) {
      console.warn('Firebase not configured, real-time sync disabled');
      return;
    }

    // Stop existing listener if any
    this.stopInventorySync();

    try {
      const medicinesCollection = collection(db, 'medicines');
      const familyQuery = query(
        medicinesCollection,
        where('familyId', '==', familyId),
        orderBy('name')
      );

      // Set up real-time listener
      this.medicinesUnsubscribe = onSnapshot(familyQuery, (snapshot) => {
        const medicines: Medicine[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data() as FirebaseMedicine;
          medicines.push({
            id: parseInt(doc.id.replace(/[^0-9]/g, '') || '0'), // Convert Firebase ID to number
            name: data.name,
            potency: data.potency,
            company: data.company,
            location: data.location,
            subLocation: data.subLocation,
            quantity: data.quantity,
            bottleSize: data.bottleSize
          });
        });

        console.log(`Firestore real-time update: ${medicines.length} medicines`);
        onUpdate(medicines);
      }, (error) => {
        console.error('Error in Firestore real-time listener:', error);
      });

      console.log('Started Firestore real-time sync for family:', familyId);
    } catch (error) {
      console.error('Error starting Firestore inventory sync:', error);
    }
  }

  /**
   * Stop listening to inventory changes
   */
  stopInventorySync(): void {
    if (this.medicinesUnsubscribe) {
      this.medicinesUnsubscribe();
      this.medicinesUnsubscribe = null;
      console.log('Stopped Firestore inventory sync');
    }
  }

  /**
   * Add medicine to Firestore (real-time sync to all family members)
   */
  async addMedicine(medicine: Omit<Medicine, 'id'>, familyId: string, addedBy: string): Promise<Medicine | null> {
    if (!this.isConfigured()) {
      console.warn('Firebase not configured, medicine not synced to Firestore');
      return null;
    }

    try {
      const medicinesCollection = collection(db, 'medicines');
      const docRef = await addDoc(medicinesCollection, {
        ...medicine,
        familyId,
        addedBy,
        lastUpdated: Timestamp.now(),
        updatedBy: addedBy
      });

      // Return medicine with Firebase document ID converted to number
      const newMedicine: Medicine = {
        ...medicine,
        id: parseInt(docRef.id.replace(/[^0-9]/g, '') || '0')
      };

      console.log('Medicine added to Firestore:', newMedicine.name);
      return newMedicine;
    } catch (error) {
      console.error('Error adding medicine to Firestore:', error);
      return null;
    }
  }

  /**
   * Update medicine in Firestore (real-time sync to all family members)
   */
  async updateMedicine(
    medicineId: string, 
    updates: Partial<Omit<Medicine, 'id'>>, 
    familyId: string, 
    updatedBy: string
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Firebase not configured, medicine update not synced to Firestore');
      return false;
    }

    try {
      const medicineDoc = doc(db, 'medicines', medicineId);
      await updateDoc(medicineDoc, {
        ...updates,
        lastUpdated: Timestamp.now(),
        updatedBy
      });

      console.log('Medicine updated in Firestore:', medicineId);
      return true;
    } catch (error) {
      console.error('Error updating medicine in Firestore:', error);
      return false;
    }
  }

  /**
   * Delete medicine from Firestore (real-time sync to all family members)
   */
  async deleteMedicine(medicineId: string, familyId: string, deletedBy: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Firebase not configured, medicine deletion not synced to Firestore');
      return false;
    }

    try {
      const medicineDoc = doc(db, 'medicines', medicineId);
      await deleteDoc(medicineDoc);

      console.log('Medicine deleted from Firestore:', medicineId);
      return true;
    } catch (error) {
      console.error('Error deleting medicine from Firestore:', error);
      return false;
    }
  }

  /**
   * Start listening to family members (for showing who's online)
   */
  startMembersSync(familyId: string, onUpdate: (members: FirebaseFamilyMember[]) => void): void {
    if (!this.isConfigured()) {
      console.warn('Firebase not configured, members sync disabled');
      return;
    }

    this.stopMembersSync();

    try {
      const membersCollection = collection(db, 'family_members');
      const membersQuery = query(
        membersCollection,
        where('familyId', '==', familyId),
        orderBy('joinedAt')
      );

      this.membersUnsubscribe = onSnapshot(membersQuery, (snapshot) => {
        const members: FirebaseFamilyMember[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data() as FirebaseFamilyMember;
          members.push({
            id: doc.id,
            ...data
          });
        });

        onUpdate(members);
      });

      console.log('Started Firestore members sync for family:', familyId);
    } catch (error) {
      console.error('Error starting Firestore members sync:', error);
    }
  }

  /**
   * Stop listening to family members
   */
  stopMembersSync(): void {
    if (this.membersUnsubscribe) {
      this.membersUnsubscribe();
      this.membersUnsubscribe = null;
    }
  }

  /**
   * Update member's last seen timestamp (for showing online status)
   */
  async updateMemberLastSeen(familyId: string, memberId: string): Promise<void> {
    if (!this.isConfigured()) {
      return;
    }

    try {
      const membersCollection = collection(db, 'family_members');
      const memberQuery = query(
        membersCollection,
        where('familyId', '==', familyId),
        where('memberId', '==', memberId)
      );

      // Note: In a production app, you'd want to get the specific document ID
      // For now, this is a simplified implementation
    } catch (error) {
      console.error('Error updating member last seen:', error);
    }
  }

  /**
   * Clean up all listeners when component unmounts
   */
  cleanup(): void {
    this.stopInventorySync();
    this.stopMembersSync();
    console.log('Firebase family service cleaned up');
  }
}

// Export singleton instance
export const firebaseFamilyService = new FirebaseFamilyService();