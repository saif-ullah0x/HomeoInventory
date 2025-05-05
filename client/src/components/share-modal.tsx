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
  const [accessLevel, setAccessLevel] = useState("view");
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
      access: accessLevel,
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
    
    // Simulate successful share code validation and sync
    // In a real implementation, this would make a request to get the shared data
    setTimeout(() => {
      toast({
        title: "Access granted",
        description: `You now have ${syncEnabled ? "synced" : "one-time"} access to shared medicines.`
      });
      
      // Close the modal
      onClose();
    }, 1000);
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
              <div>
                <h3 className="font-medium mb-2">Access Level</h3>
                <RadioGroup defaultValue="view" value={accessLevel} onValueChange={setAccessLevel}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="view" id="option-view" />
                    <Label htmlFor="option-view" className="flex items-center">
                      <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                      View-only access
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="edit" id="option-edit" />
                    <Label htmlFor="option-edit" className="flex items-center">
                      <Edit2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      Full edit access
                    </Label>
                  </div>
                </RadioGroup>
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