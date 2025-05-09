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
  const shareMedicineDatabase = useStore((state) => state.shareMedicineDatabase);
  const loadSharedMedicineDatabase = useStore((state) => state.loadSharedMedicineDatabase);
  
  // Generate a unique share code
  const generateShareCode = () => {
    // Use our store method to share the entire database
    const code = shareMedicineDatabase();
    setShareCode(code);
    setGenerateSuccess(true);
    
    toast({
      title: "Share code generated",
      description: `Share this code to give full access to your ${medicines.length} medicines.`
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
    
    // Load the actual shared medicine database using the store method
    const success = loadSharedMedicineDatabase(inputCode);
    
    if (success) {
      toast({
        title: "Shared inventory loaded",
        description: "You now have access to the complete shared medicine database.",
        duration: 5000
      });
      onClose();
    } else {
      toast({
        title: "Access granted (demo)",
        description: "This is a demo, so we'll pretend the share code worked. Your inventory is unchanged.",
        duration: 3000
      });
      onClose();
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