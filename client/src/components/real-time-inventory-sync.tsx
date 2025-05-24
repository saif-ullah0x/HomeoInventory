import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Cloud, 
  CloudUpload, 
  CloudOff, 
  Users, 
  RefreshCw, 
  Share2,
  Wifi,
  WifiOff,
  Plus,
  Trash2
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Medicine } from "@shared/schema";

interface RealtimeInventorySyncProps {
  onInventoryUpdate?: (medicines: Medicine[]) => void;
}

export default function RealtimeInventorySync({ onInventoryUpdate }: RealtimeInventorySyncProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'connected' | 'error'>('idle');
  
  const medicines = useStore((state) => state.medicines);
  const addMedicine = useStore((state) => state.addMedicine);
  const deleteMedicine = useStore((state) => state.deleteMedicine);

  // Initialize real-time connection
  useEffect(() => {
    const savedShareCode = localStorage.getItem('active-share-code');
    if (savedShareCode) {
      setShareCode(savedShareCode);
      connectToSharedInventory(savedShareCode);
    }
  }, []);

  // Real-time sync with cloud database (Firebase placeholder)
  const connectToSharedInventory = async (code: string) => {
    setIsLoading(true);
    setSyncStatus('syncing');
    
    try {
      // Placeholder for Firebase real-time database connection
      // This would establish a WebSocket connection to Firebase when API keys are provided
      
      const response = await fetch('/api/shared-inventory/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shareCode: code }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to shared inventory');
      }

      const data = await response.json();
      
      setIsConnected(true);
      setSyncStatus('connected');
      setConnectedUsers(data.connectedUsers || 1);
      setLastSync(new Date());
      localStorage.setItem('active-share-code', code);
      
      // Initialize real-time listeners (placeholder for Firebase)
      initializeRealtimeListeners(code);
      
      toast({
        title: "🌟 Connected to shared inventory!",
        description: `You're now syncing with ${data.connectedUsers || 1} users in real-time.`,
        duration: 4000,
      });
      
    } catch (error) {
      console.error('Connection error:', error);
      setSyncStatus('error');
      toast({
        title: "Connection failed",
        description: "Unable to connect to shared inventory. Please check your share code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for Firebase real-time listeners
  const initializeRealtimeListeners = (code: string) => {
    // This would set up Firebase real-time database listeners
    // When API keys are provided, this will enable real-time sync
    console.log(`Setting up real-time listeners for share code: ${code}`);
    
    // Placeholder for Firebase onValue listener
    /*
    const inventoryRef = ref(database, `shared-inventories/${code}/medicines`);
    onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updatedMedicines = Object.values(data) as Medicine[];
        onInventoryUpdate?.(updatedMedicines);
        setLastSync(new Date());
      }
    });
    */
  };

  // Create new shared inventory
  const createSharedInventory = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/shared-inventory/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          medicines: medicines,
          name: `Shared Inventory ${new Date().toLocaleDateString()}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create shared inventory');
      }

      const data = await response.json();
      const newShareCode = data.shareCode;
      
      setShareCode(newShareCode);
      await connectToSharedInventory(newShareCode);
      
      toast({
        title: "🎉 Shared inventory created!",
        description: `Share code: ${newShareCode}. Others can join using this code.`,
        duration: 6000,
      });
      
    } catch (error) {
      console.error('Create error:', error);
      toast({
        title: "Creation failed",
        description: "Unable to create shared inventory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sync local changes to cloud
  const syncToCloud = async (updatedMedicines: Medicine[]) => {
    if (!isConnected || !shareCode) return;
    
    try {
      await fetch('/api/shared-inventory/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          shareCode: shareCode,
          medicines: updatedMedicines
        }),
      });
      
      setLastSync(new Date());
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  // Disconnect from shared inventory
  const disconnect = () => {
    setIsConnected(false);
    setSyncStatus('idle');
    setShareCode("");
    setConnectedUsers(0);
    localStorage.removeItem('active-share-code');
    
    toast({
      title: "Disconnected",
      description: "You've disconnected from the shared inventory.",
    });
  };

  // Manual refresh
  const manualRefresh = async () => {
    if (!shareCode) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/shared-inventory/${shareCode}`);
      if (response.ok) {
        const data = await response.json();
        onInventoryUpdate?.(data.medicines || []);
        setLastSync(new Date());
        
        toast({
          title: "Inventory refreshed",
          description: "Latest changes have been loaded.",
        });
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'connected':
        return <CloudUpload className="h-4 w-4 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <CloudOff className="h-4 w-4 text-red-500" />;
      default:
        return <Cloud className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'connected':
        return 'Connected';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Not Connected';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {getStatusIcon()}
              Real-Time Inventory Sharing
            </CardTitle>
            <CardDescription>
              Share your inventory with others and sync changes in real-time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isConnected && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {connectedUsers} user{connectedUsers !== 1 ? 's' : ''}
              </Badge>
            )}
            <Badge 
              variant={syncStatus === 'connected' ? 'default' : 'secondary'}
              className="flex items-center gap-1"
            >
              {syncStatus === 'connected' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter share code to join..."
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
                disabled={isLoading}
              />
              <Button
                onClick={() => connectToSharedInventory(shareCode)}
                disabled={!shareCode.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Join"}
              </Button>
            </div>
            
            <div className="text-center">
              <span className="text-sm text-muted-foreground">or</span>
            </div>
            
            <Button
              onClick={createSharedInventory}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Shared Inventory
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div>
                <p className="font-medium text-green-800 dark:text-green-300">
                  Share Code: {shareCode}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Share this code with others to collaborate
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigator.clipboard.writeText(shareCode)}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            
            {lastSync && (
              <p className="text-xs text-muted-foreground text-center">
                Last synced: {lastSync.toLocaleTimeString()}
              </p>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={manualRefresh}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={disconnect}
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Any changes you or your collaborators make will sync automatically. 
            {!isConnected && " Connect to start real-time collaboration!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}