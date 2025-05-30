/**
 * Family API Service
 * Handles all API calls for family-based medicine inventory
 */

import type { Medicine, InsertMedicine } from "@shared/schema";

interface FamilyMedicineData extends Omit<InsertMedicine, 'familyId'> {
  updatedBy: string;
}

interface UpdateMedicineData extends Partial<Omit<InsertMedicine, 'familyId'>> {
  updatedBy: string;
}

class FamilyApiService {
  
  async getFamilyMedicines(familyId: string): Promise<Medicine[]> {
    const response = await fetch(`/api/family/${familyId}/medicines`);
    if (!response.ok) {
      throw new Error('Failed to fetch family medicines');
    }
    return response.json();
  }

  async addMedicine(familyId: string, medicineData: FamilyMedicineData): Promise<Medicine> {
    const response = await fetch(`/api/family/${familyId}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicineData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to add medicine');
    }
    return response.json();
  }

  async updateMedicine(familyId: string, medicineId: number, updates: UpdateMedicineData): Promise<Medicine> {
    const response = await fetch(`/api/family/${familyId}/medicines/${medicineId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update medicine');
    }
    return response.json();
  }

  async deleteMedicine(familyId: string, medicineId: number, updatedBy: string): Promise<void> {
    const response = await fetch(`/api/family/${familyId}/medicines/${medicineId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updatedBy })
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete medicine');
    }
  }

  async getFamilyMembers(familyId: string) {
    const response = await fetch(`/api/family/${familyId}/members`);
    if (!response.ok) {
      throw new Error('Failed to fetch family members');
    }
    return response.json();
  }
}

export const familyApi = new FamilyApiService();