/**
 * Family WebSocket Service
 * Handles real-time synchronization of family inventory changes
 */

import { useStore } from './store';

interface WebSocketMessage {
  type: 'INVENTORY_UPDATE' | 'MEMBER_JOINED' | 'MEMBER_LEFT' | 'FULL_INVENTORY' | 'FAMILY_JOINED' | 'ERROR' | 'PONG';
  data?: any;
  familyId?: string;
  message?: string;
}

class FamilyWebSocketService {
  private ws: WebSocket | null = null;
  private familyId: string | null = null;
  private memberId: string | null = null;
  private memberName: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  connect(familyId: string, memberId: string, memberName: string) {
    this.familyId = familyId;
    this.memberId = memberId;
    this.memberName = memberName;
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('Connected to family inventory sync');
        this.reconnectAttempts = 0;
        
        // Join family room
        this.send({
          type: 'JOIN_FAMILY',
          familyId: this.familyId,
          memberId: this.memberId,
          memberName: this.memberName
        });
        
        // Start heartbeat
        this.startHeartbeat();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('Disconnected from family inventory sync');
        this.stopHeartbeat();
        this.attemptReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const store = useStore.getState();
    
    switch (message.type) {
      case 'INVENTORY_UPDATE':
        if (message.data) {
          this.handleInventoryUpdate(message.data);
        }
        break;
        
      case 'FULL_INVENTORY':
        if (message.data && message.data.medicines) {
          store.setMedicines(message.data.medicines);
        }
        break;
        
      case 'FAMILY_JOINED':
        console.log('Successfully joined family inventory sync');
        break;
        
      case 'MEMBER_JOINED':
        console.log(`${message.data?.memberName || 'Family member'} joined the inventory`);
        break;
        
      case 'MEMBER_LEFT':
        console.log(`${message.data?.memberName || 'Family member'} left the inventory`);
        break;
        
      case 'ERROR':
        console.error('WebSocket error:', message.message);
        break;
        
      case 'PONG':
        // Heartbeat response
        break;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private handleInventoryUpdate(update: any) {
    const store = useStore.getState();
    
    switch (update.type) {
      case 'ADD':
        if (update.medicine) {
          store.addMedicine(update.medicine);
        }
        break;
        
      case 'UPDATE':
        if (update.medicine) {
          store.updateMedicine(update.medicine.id, update.medicine);
        }
        break;
        
      case 'DELETE':
        if (update.medicineId) {
          store.deleteMedicine(update.medicineId);
        }
        break;
    }
  }

  private send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private startHeartbeat() {
    setInterval(() => {
      this.send({ type: 'PING' });
    }, 30000); // Ping every 30 seconds
  }

  private stopHeartbeat() {
    // Heartbeat will stop when connection is lost
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      if (this.familyId && this.memberId && this.memberName) {
        this.connect(this.familyId, this.memberId, this.memberName);
      }
    }, delay);
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.familyId = null;
    this.memberId = null;
    this.memberName = null;
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const familyWebSocket = new FamilyWebSocketService();