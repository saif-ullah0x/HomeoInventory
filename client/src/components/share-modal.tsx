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
import { Copy, CheckCircle, Users, Link as LinkIcon, Eye, Edit2, Cloud, Loader2, Unlink } from "lucide-react";
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
  const [networkError, setNetworkError] = useState(false);
  
  const copyLinkRef = useRef<HTMLInputElement>(null);
  
  // Get store functions
  const medicines = useStore((state) => state.medicines);
  const shareMedicineDatabase = useStore((state) => state.shareMedicineDatabase);
  const loadSharedMedicineDatabase = useStore((state) => state.loadSharedMedicineDatabase);
  
  // Check for existing saved share code
  const [hasActiveSharedInventory, setHasActiveSharedInventory] = useState(false);
  
  useEffect(() => {
    // Load any saved share code from localStorage
    const savedShareCode = localStorage.getItem('saved-share-code');
    if (savedShareCode && savedShareCode.length > 0) {
      setInputCode(savedShareCode);
      setHasActiveSharedInventory(true);
    }
  }, []);
  
  // Function to unlink from the current shared inventory
  const unlinkSharedInventory = () => {
    // Remove the saved code
    localStorage.removeItem('saved-share-code');
    setHasActiveSharedInventory(false);
    
    // Reset the input field
    setInputCode('');
    
    // Reload the page to restore the user's original inventory
    window.location.reload();
  };
  
  // Create a family-based shared inventory
  const generateShareCode = async () => {
    setIsLoading(true);
    setNetworkError(false);
    
    try {
      // Create a new family for sharing
      const response = await fetch('/api/family/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberName: inventoryName || 'Family Admin'
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const familyId = data.familyId;
        
        setShareCode(familyId);
        setGenerateSuccess(true);
        
        toast({
          title: "Family ID created",
          description: `Family ID: ${familyId}. Share this with family members for real-time access.`,
          duration: 5000
        });
      } else {
        console.error('Failed to create family inventory:', await response.text());
        setNetworkError(true);
        
        toast({
          title: "Failed to create family",
          description: "Unable to create family inventory. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating family inventory:', error);
      setNetworkError(true);
      
      toast({
        title: "Connection error",
        description: "Unable to create family inventory. Please check your connection and try again.",
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
        // Save the share code to localStorage for persistence
        localStorage.setItem('saved-share-code', inputCode);
        
        toast({
          title: "Shared inventory loaded",
          description: networkError 
            ? "Connected to local inventory (cloud not available)."
            : "You now have access to the shared medicine inventory.",
          duration: 5000
        });
        
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
        // Save the share code to localStorage for persistence
        localStorage.setItem('saved-share-code', inputCode);
        
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
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-white/90 to-white/60 dark:from-gray-900/90 dark:to-gray-900/60 backdrop-blur-md border border-purple-100/30 dark:border-purple-900/30 glass-effect">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
            Family Access Sharing
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Share your medicine inventory with family members or access a shared inventory.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2 bg-purple-100/50 dark:bg-purple-900/20">
            <TabsTrigger value="create" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">Share My Inventory</TabsTrigger>
            <TabsTrigger value="use" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm">Access Shared Inventory</TabsTrigger>
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
                    
                    {/* View-only option removed as requested */}
                    
                    <Button 
                      onClick={generateShareCode} 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Users className="mr-2 h-4 w-4" />
                      )}
                      {isLoading ? "Creating Family ID..." : "Create Family ID"}
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
                      <Button 
                      size="sm" 
                      onClick={copyShareLink} 
                      className="shrink-0 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-300"
                    >
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
                      <span className="ml-1">Full Access</span>
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
              
              {hasActiveSharedInventory ? (
                <div className="space-y-4">
                  <Alert className="bg-primary/10 border-primary/20">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <AlertTitle>Currently using a shared inventory</AlertTitle>
                    <AlertDescription className="text-sm mt-2">
                      You are currently accessing a shared inventory with code: <span className="font-mono font-medium">{inputCode}</span>
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    onClick={unlinkSharedInventory} 
                    variant="destructive"
                    className="w-full"
                  >
                    <Unlink className="mr-2 h-4 w-4" />
                    Unlink from Shared Inventory
                  </Button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}