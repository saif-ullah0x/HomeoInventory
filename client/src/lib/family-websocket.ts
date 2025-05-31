/**
 * Family WebSocket Service - Simplified Version
 * Real-time functionality is handled by Firebase Firestore
 */

export class FamilyWebSocketService {
  private familyId: string = '';
  private memberId: string = '';
  private memberName: string = '';

  connect(familyId: string, memberId: string, memberName: string) {
    this.familyId = familyId;
    this.memberId = memberId;
    this.memberName = memberName;
    
    // Real-time sync is handled by Firebase Firestore
    console.log('Family sync enabled via Firebase Firestore for:', familyId);
  }

  disconnect() {
    console.log('Family sync disabled');
    this.familyId = '';
    this.memberId = '';
    this.memberName = '';
  }

  isConnected(): boolean {
    return !!this.familyId;
  }
}

// Export singleton instance
export const familyWebSocketService = new FamilyWebSocketService();