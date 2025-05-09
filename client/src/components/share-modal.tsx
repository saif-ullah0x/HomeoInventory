import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Copy, CheckCircle, Users, Link as LinkIcon, Eye, Edit2, Cloud, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("create");
  const [shareCode, setShareCode] = useState("");
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [codeWarning, setCodeWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryName, setInventoryName] = useState("My Medicine Inventory");
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  
  const copyLinkRef = useRef<HTMLInputElement>(null);
  
  // Get store functions
  const medicines = useStore((state) => state.medicines);
  const shareMedicineDatabase = useStore((state) => state.shareMedicineDatabase);
  const loadSharedMedicineDatabase = useStore((state) => state.loadSharedMedicineDatabase);
  
  // Set up a loading state when network operations are happening
  useEffect(() => {
    // Clean up any shared inventory banner when the modal is closed
    return () => {
      const existingBanner = document.getElementById('shared-inventory-banner');
      if (existingBanner) {
        existingBanner.remove();
      }
    };
  }, []);
  
  // Generate a cloud-based share code
  const generateShareCode = async () => {
    setIsLoading(true);
    setNetworkError(false);
    
    try {
      // Create a cloud-based shared inventory
      const response = await fetch('/api/shared-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicines: medicines,
          name: inventoryName,
          isViewOnly: isViewOnly
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const cloudCode = data.inventoryId;
        
        // Use the store method to also save locally
        shareMedicineDatabase();
        
        setShareCode(cloudCode);
        setGenerateSuccess(true);
        
        toast({
          title: "Share code generated",
          description: `Share this code to give access to your ${medicines.length} medicines.`,
          duration: 5000
        });
      } else {
        console.error('Failed to create cloud inventory:', await response.text());
        setNetworkError(true);
        
        // Fallback to local-only sharing
        const localCode = shareMedicineDatabase();
        setShareCode(localCode);
        setGenerateSuccess(true);
        
        toast({
          title: "Local share code generated",
          description: "Could not connect to cloud storage. Your inventory can only be shared on this device.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating shared inventory:', error);
      setNetworkError(true);
      
      // Fallback to local-only sharing
      const localCode = shareMedicineDatabase();
      setShareCode(localCode);
      setGenerateSuccess(true);
      
      toast({
        title: "Local share code generated",
        description: "Could not connect to cloud storage. Your inventory can only be shared on this device.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Copy share link to clipboard
  const copyShareLink = () => {
    if (copyLinkRef.current) {
      copyLinkRef.current.select();
      navigator.clipboard.writeText(shareCode).catch(() => {
        // Fallback for older browsers
        document.execCommand('copy');
      });
      
      toast({
        title: "Share code copied",
        description: "The code has been copied to your clipboard."
      });
    }
  };
  
  // Use someone else's share code
  const useShareCode = async () => {
    // Simple validation
    if (!inputCode || inputCode.length < 5) {
      setCodeWarning(true);
      return;
    }
    
    setCodeWarning(false);
    setIsLoading(true);
    setNetworkError(false);
    
    try {
      // First try to fetch from the cloud
      const response = await fetch(`/api/shared-inventory/${inputCode}`);
      
      let success = false;
      let sharedInventoryName = "";
      
      if (response.ok) {
        // Cloud fetch successful
        const data = await response.json();
        
        // Load the medicines into local database
        success = await loadSharedMedicineDatabase(inputCode);
        sharedInventoryName = data.name || "Shared Inventory";
      } else {
        // Fallback to local storage
        success = await loadSharedMedicineDatabase(inputCode);
        setNetworkError(true);
      }
      
      if (success) {
        toast({
          title: "Shared inventory loaded",
          description: networkError 
            ? "Connected to local inventory (cloud not available)."
            : "You now have access to the shared medicine inventory.",
          duration: 5000
        });
        
        // Add a banner to show we're viewing shared data
        const existingBanner = document.getElementById('shared-inventory-banner');
        if (existingBanner) {
          existingBanner.remove();
        }
        
        const sharedBanner = document.createElement('div');
        sharedBanner.id = 'shared-inventory-banner';
        sharedBanner.className = 'fixed top-16 left-0 right-0 bg-primary text-white py-2 px-4 text-center text-sm z-50';
        sharedBanner.innerHTML = `Viewing shared inventory: ${sharedInventoryName} (Code: ${inputCode})`;
        document.body.appendChild(sharedBanner);
        
        onClose();
      } else {
        toast({
          title: "Error loading inventory",
          description: "The share code is invalid or the inventory no longer exists.",
          variant: "destructive",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error accessing shared inventory:", error);
      setNetworkError(true);
      
      // Try local fallback
      const success = await loadSharedMedicineDatabase(inputCode);
      
      if (success) {
        toast({
          title: "Local inventory loaded",
          description: "Connected to local inventory (cloud not available).",
          duration: 5000
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Could not find the shared inventory with this code.",
          variant: "destructive",
          duration: 3000
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Family Access Sharing</DialogTitle>
          <DialogDescription>
            Share your medicine inventory with family members or access a shared inventory.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Share My Inventory</TabsTrigger>
            <TabsTrigger value="use">Access Shared Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-4 mb-2 flex gap-2">
                <Cloud className="h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-normal">
                  Your medicine inventory will be securely stored in the cloud and accessible by family members with the share code.
                </p>
              </div>
              
              {!generateSuccess ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="inventory-name" className="block mb-2">Inventory Name</Label>
                      <Input 
                        id="inventory-name"
                        value={inventoryName}
                        onChange={(e) => setInventoryName(e.target.value)}
                        placeholder="My Medicine Inventory"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This name will be shown to anyone who accesses your inventory.
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 py-2">
                      <Switch 
                        id="view-only" 
                        checked={isViewOnly}
                        onCheckedChange={setIsViewOnly}
                      />
                      <Label htmlFor="view-only">View-only access (prevent editing)</Label>
                    </div>
                    
                    <Button 
                      onClick={generateShareCode} 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Cloud className="mr-2 h-4 w-4" />
                      )}
                      {isLoading ? "Creating Share Code..." : "Generate Share Code"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {networkError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTitle className="flex items-center">
                        <Cloud className="h-4 w-4 mr-2" />
                        Cloud Storage Unavailable
                      </AlertTitle>
                      <AlertDescription>
                        Could not connect to cloud storage. This inventory can only be accessed on this device.
                      </AlertDescription>
                    </Alert>
                  )}
                
                  <div className="bg-muted p-4 rounded-lg">
                    <Label htmlFor="share-code" className="block mb-2 text-sm">Your share code</Label>
                    <div className="flex">
                      <Input 
                        id="share-code"
                        ref={copyLinkRef}
                        value={shareCode}
                        readOnly
                        className="mr-2"
                      />
                      <Button size="sm" onClick={copyShareLink} className="shrink-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-sm flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium">Code successfully generated</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Share this code with your family members. They can enter this code to access your medicine inventory.
                    </p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    <p className="flex items-center">
                      <span className="font-medium">Inventory Name:</span>
                      <span className="ml-1">{inventoryName}</span>
                    </p>
                    <p className="flex items-center mt-1">
                      <span className="font-medium">Access Type:</span>
                      <span className="ml-1">{isViewOnly ? "View Only" : "Full Access"}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="use" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-4 mb-2 flex gap-2">
                <Users className="h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-normal">
                  Access a shared medicine inventory by entering the share code provided to you.
                </p>
              </div>
              
              <div>
                <Label htmlFor="input-code" className="block mb-2">Enter share code</Label>
                <Input 
                  id="input-code"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    setCodeWarning(false);
                  }}
                  placeholder="Enter the code you received"
                  className={codeWarning ? "border-red-500" : ""}
                />
                {codeWarning && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid share code</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 py-2">
                <Switch 
                  id="sync-mode" 
                  checked={syncEnabled}
                  onCheckedChange={setSyncEnabled}
                />
                <Label htmlFor="sync-mode">Keep synchronized with source inventory</Label>
              </div>
              
              <Button 
                onClick={useShareCode} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LinkIcon className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Accessing Inventory..." : "Access Shared Inventory"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}