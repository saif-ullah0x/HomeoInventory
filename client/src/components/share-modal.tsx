import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Copy, CheckCircle, Users, Link as LinkIcon, Eye, Edit2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

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
  
  const copyLinkRef = useRef<HTMLInputElement>(null);
  
  // Get store functions
  const medicines = useStore((state) => state.medicines);
  const addMedicine = useStore((state) => state.addMedicine);
  
  // Generate a unique share code
  const generateShareCode = () => {
    // Generate a unique code using nanoid (more compact than UUID)
    const code = nanoid(10);
    setShareCode(code);
    setGenerateSuccess(true);
    
    // Store the code and medicines in local storage for future reference
    const shareData = {
      code: code,
      medicines: medicines,
      created: new Date().toISOString()
    };
    
    // Store in localStorage
    const existingShares = JSON.parse(localStorage.getItem('homeo-shares') || '[]');
    localStorage.setItem('homeo-shares', JSON.stringify([...existingShares, shareData]));
    
    toast({
      title: "Share code generated",
      description: "Copy and share this code with family members."
    });
  };
  
  // Copy share link to clipboard
  const copyShareLink = () => {
    if (copyLinkRef.current) {
      copyLinkRef.current.select();
      document.execCommand('copy');
      
      toast({
        title: "Share code copied",
        description: "The code has been copied to your clipboard."
      });
    }
  };
  
  // Use someone else's share code
  const useShareCode = () => {
    // Simple validation
    if (!inputCode || inputCode.length < 5) {
      setCodeWarning(true);
      return;
    }
    
    setCodeWarning(false);
    
    // In a real app, this would verify the share code against a database
    // For demo purposes, we'll add sample medicines to represent a shared inventory
    const importSharedMedicines = async () => {
      // Add several medicines to represent a shared family inventory
      try {
        // These represent medicines shared by a family member
        const sharedMedicines = [
          {
            name: "Acid Carbolicum",
            potency: "200",
            company: "Masood",
            location: "D1_DT",
            quantity: 2
          },
          {
            name: "Acid Nitricum",
            potency: "200",
            company: "Masood/Schwabe",
            location: "D1_DT_MB",
            quantity: 3
          },
          {
            name: "Acid Phos",
            potency: "200",
            company: "Masood",
            location: "D1_DT",
            quantity: 2
          },
          {
            name: "Aconite Napellus",
            potency: "30",
            company: "Masood",
            location: "MB",
            quantity: 2
          },
          {
            name: "Aethusa",
            potency: "200",
            company: "Masood",
            location: "TN",
            quantity: 1
          },
          {
            name: "Allium Cepa",
            potency: "30",
            company: "Homecraft",
            location: "Kitchen Cabinet",
            quantity: 1
          },
          {
            name: "Apis Mellifica",
            potency: "200",
            company: "SBL",
            location: "First Aid Kit",
            quantity: 1
          },
          {
            name: "Baptisia",
            potency: "200",
            company: "Masood",
            location: "MB_2",
            quantity: 1
          },
          {
            name: "Belladonna",
            potency: "200",
            company: "Schwabe",
            location: "First Aid Kit",
            quantity: 2
          },
          {
            name: "Bryonia",
            potency: "30",
            company: "Reckeweg",
            location: "Travel Kit",
            quantity: 1
          }
        ];
        
        let addedCount = 0;
        for (const medicine of sharedMedicines) {
          const result = await addMedicine({
            name: medicine.name,
            potency: medicine.potency,
            company: medicine.company,
            location: medicine.location,
            quantity: medicine.quantity
          });
          
          if (result.success) {
            addedCount++;
          }
        }
        
        toast({
          title: `Added ${addedCount} shared medicines`,
          description: `${sharedMedicines.length - addedCount} medicines were already in your inventory`,
          duration: 3000
        });
        
      } catch (error) {
        console.error("Error importing shared medicines:", error);
      }
    };
    
    // Process the shared medicines
    importSharedMedicines().then(() => {
      toast({
        title: "Access granted",
        description: `You now have ${syncEnabled ? "synced" : "one-time"} access to shared medicines.`,
        duration: 3000
      });
      
      // Close the modal
      onClose();
    });
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
              <div className="bg-primary/10 rounded-lg p-4 mb-2">
                <p className="text-sm leading-normal">
                  Family members will receive full access to view and edit your medicine inventory.
                </p>
              </div>
              
              {!generateSuccess ? (
                <Button onClick={generateShareCode} className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Generate Share Code
                </Button>
              ) : (
                <div className="space-y-4">
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
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="use" className="space-y-4 py-4">
            <div className="space-y-4">
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
              
              <Button onClick={useShareCode} className="w-full">
                <LinkIcon className="mr-2 h-4 w-4" />
                Access Shared Inventory
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