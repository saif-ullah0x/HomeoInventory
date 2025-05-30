/**
 * Family Inventory Service
 * Handles real-time synchronization of medicine inventory across family members
 * When any family member makes changes, all other members see updates instantly
 */

import { WebSocket } from 'ws';
import { nanoid } from 'nanoid';
import { db } from '@db';
import { medicines, sharedInventories, type InsertMedicine, type Medicine } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

interface FamilyMember {
  ws: WebSocket;
  familyId: string;
  memberId: string;
  memberName?: string;
}

interface InventoryUpdate {
  type: 'ADD' | 'UPDATE' | 'DELETE';
  medicine?: Medicine;
  medicineId?: number;
  familyId: string;
  updatedBy: string;
  timestamp: Date;
}

class FamilyInventoryService {
  private familyConnections = new Map<string, Set<FamilyMember>>();
  private memberConnections = new Map<WebSocket, FamilyMember>();

  /**
   * Add a family member to real-time sync
   */
  addFamilyMember(ws: WebSocket, familyId: string, memberId: string, memberName?: string) {
    const member: FamilyMember = {
      ws,
      familyId,
      memberId,
      memberName
    };

    // Add to member tracking
    this.memberConnections.set(ws, member);

    // Add to family tracking
    if (!this.familyConnections.has(familyId)) {
      this.familyConnections.set(familyId, new Set());
    }
    this.familyConnections.get(familyId)!.add(member);

    // Send current inventory to the new member
    this.sendCurrentInventory(ws, familyId);

    // Notify other family members about new connection
    this.broadcastToFamily(familyId, {
      type: 'MEMBER_JOINED',
      memberName: memberName || 'Family Member',
      timestamp: new Date()
    }, memberId);

    console.log(`Family member ${memberName || memberId} joined family ${familyId}`);
  }

  /**
   * Remove family member from sync when they disconnect
   */
  removeFamilyMember(ws: WebSocket) {
    const member = this.memberConnections.get(ws);
    if (!member) return;

    // Remove from member tracking
    this.memberConnections.delete(ws);

    // Remove from family tracking
    const familyMembers = this.familyConnections.get(member.familyId);
    if (familyMembers) {
      familyMembers.delete(member);
      if (familyMembers.size === 0) {
        this.familyConnections.delete(member.familyId);
      }
    }

    // Notify other family members about disconnection
    this.broadcastToFamily(member.familyId, {
      type: 'MEMBER_LEFT',
      memberName: member.memberName || 'Family Member',
      timestamp: new Date()
    }, member.memberId);

    console.log(`Family member ${member.memberName || member.memberId} left family ${member.familyId}`);
  }

  /**
   * Broadcast inventory update to all family members
   */
  async broadcastInventoryUpdate(familyId: string, update: InventoryUpdate, excludeMemberId?: string) {
    const familyMembers = this.familyConnections.get(familyId);
    if (!familyMembers) return;

    const message = JSON.stringify({
      type: 'INVENTORY_UPDATE',
      data: update
    });

    for (const member of Array.from(familyMembers)) {
      if (excludeMemberId && member.memberId === excludeMemberId) continue;
      
      if (member.ws.readyState === WebSocket.OPEN) {
        try {
          member.ws.send(message);
        } catch (error) {
          console.error('Error sending update to family member:', error);
          // Remove disconnected member
          this.removeFamilyMember(member.ws);
        }
      }
    }
  }

  /**
   * Send current inventory to a specific member
   */
  private async sendCurrentInventory(ws: WebSocket, familyId: string) {
    try {
      // Get family inventory from database
      const familyInventory = await this.getFamilyInventory(familyId);
      
      const message = JSON.stringify({
        type: 'FULL_INVENTORY',
        data: {
          medicines: familyInventory,
          familyId: familyId,
          timestamp: new Date()
        }
      });

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    } catch (error) {
      console.error('Error sending current inventory:', error);
    }
  }

  /**
   * Get all medicines for a family
   */
  async getFamilyInventory(familyId: string): Promise<Medicine[]> {
    try {
      // Get family medicines from database
      const familyMedicines = await db.query.medicines.findMany({
        where: eq(medicines.familyId, familyId),
        orderBy: (medicines, { asc }) => [asc(medicines.name)]
      });
      return familyMedicines;
    } catch (error) {
      console.error('Error fetching family inventory:', error);
      return [];
    }
  }

  /**
   * Add medicine to family inventory and sync
   */
  async addMedicine(familyId: string, medicineData: Omit<InsertMedicine, 'familyId'>, updatedBy: string): Promise<Medicine | null> {
    try {
      const medicineWithFamily = {
        ...medicineData,
        familyId: familyId
      };

      const [newMedicine] = await db.insert(medicines).values(medicineWithFamily).returning();

      // Broadcast update to all family members
      await this.broadcastInventoryUpdate(familyId, {
        type: 'ADD',
        medicine: newMedicine,
        familyId,
        updatedBy,
        timestamp: new Date()
      }, updatedBy);

      return newMedicine;
    } catch (error) {
      console.error('Error adding medicine to family inventory:', error);
      return null;
    }
  }

  /**
   * Update medicine in family inventory and sync
   */
  async updateMedicine(familyId: string, medicineId: number, updates: Partial<InsertMedicine>, updatedBy: string): Promise<Medicine | null> {
    try {
      const [updatedMedicine] = await db
        .update(medicines)
        .set(updates)
        .where(and(eq(medicines.id, medicineId), eq(medicines.familyId, familyId)))
        .returning();

      if (updatedMedicine) {
        // Broadcast update to all family members
        await this.broadcastInventoryUpdate(familyId, {
          type: 'UPDATE',
          medicine: updatedMedicine,
          familyId,
          updatedBy,
          timestamp: new Date()
        }, updatedBy);
      }

      return updatedMedicine || null;
    } catch (error) {
      console.error('Error updating medicine in family inventory:', error);
      return null;
    }
  }

  /**
   * Delete medicine from family inventory and sync
   */
  async deleteMedicine(familyId: string, medicineId: number, updatedBy: string): Promise<boolean> {
    try {
      const deletedRows = await db
        .delete(medicines)
        .where(and(eq(medicines.id, medicineId), eq(medicines.familyId, familyId)))
        .returning();

      if (deletedRows.length > 0) {
        // Broadcast update to all family members
        await this.broadcastInventoryUpdate(familyId, {
          type: 'DELETE',
          medicineId,
          familyId,
          updatedBy,
          timestamp: new Date()
        }, updatedBy);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting medicine from family inventory:', error);
      return false;
    }
  }

  /**
   * Create a new family inventory
   */
  async createFamily(memberName: string): Promise<string> {
    const familyId = nanoid(8); // Generate short family ID
    
    try {
      // For the new family system, we don't need to create a record in sharedInventories
      // The family is identified by the familyId, and medicines are stored in the medicines table
      // with the familyId as a foreign key
      
      console.log(`Created family ${familyId} for ${memberName}`);
      return familyId;
    } catch (error) {
      console.error('Error creating family:', error);
      throw error;
    }
  }

  /**
   * Join existing family
   */
  async joinFamily(familyId: string, memberName: string): Promise<boolean> {
    try {
      // For the new family system, we validate the familyId format
      // Any valid familyId (8 characters) can be joined, as families are created on-demand
      if (familyId && familyId.length === 8) {
        console.log(`${memberName} joined family ${familyId}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error joining family:', error);
      return false;
    }
  }

  /**
   * Broadcast message to all family members
   */
  private broadcastToFamily(familyId: string, message: any, excludeMemberId?: string) {
    const familyMembers = this.familyConnections.get(familyId);
    if (!familyMembers) return;

    const messageStr = JSON.stringify(message);

    for (const member of Array.from(familyMembers)) {
      if (excludeMemberId && member.memberId === excludeMemberId) continue;
      
      if (member.ws.readyState === WebSocket.OPEN) {
        try {
          member.ws.send(messageStr);
        } catch (error) {
          console.error('Error broadcasting to family member:', error);
        }
      }
    }
  }

  /**
   * Get connected family members count
   */
  getFamilyMembersCount(familyId: string): number {
    const familyMembers = this.familyConnections.get(familyId);
    return familyMembers ? familyMembers.size : 0;
  }

  /**
   * Get list of connected family members
   */
  getFamilyMembers(familyId: string): Array<{memberId: string, memberName?: string}> {
    const familyMembers = this.familyConnections.get(familyId);
    if (!familyMembers) return [];

    return Array.from(familyMembers).map(member => ({
      memberId: member.memberId,
      memberName: member.memberName
    }));
  }
}

// Export singleton instance
export const familyInventoryService = new FamilyInventoryService();