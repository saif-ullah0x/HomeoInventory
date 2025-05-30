/**
 * Firebase Family Sharing Modal - HomeoInvent
 * 
 * This component provides a clean interface for:
 * 1. Creating a new family inventory (generates unique family ID)
 * 2. Joining an existing family using a family code
 * 
 * All inventory changes sync in real-time across family members using Firebase Firestore
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Plus, 
  UserCheck, 
  Copy, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  Home
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { firebaseFamilyService } from "@/lib/firebase-family-service";

interface FirebaseFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FirebaseFamilyModal({ isOpen, onClose }: FirebaseFamilyModalProps) {
  const { toast } = useToast();
  
  // Component state
  const [activeTab, setActiveTab] = useState("create");
  const [isLoading, setIsLoading] = useState(false);
  const [createdFamilyId, setCreatedFamilyId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Create family state
  const [memberName, setMemberName] = useState("");
  
  // Join family state
  const [joinMemberName, setJoinMemberName] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [joinError, setJoinError] = useState("");
  
  // Store functions
  const { 
    initializeFamilySync, 
    loadFamilyInventory,
    setFamilyId,
    setMemberName: setStoreMemberName,
    familyId: currentFamilyId,
    memberName: currentMemberName
  } = useStore();

  /**
   * Generate a unique family ID (8 characters, easy to share)
   */
  const generateFamilyId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  /**
   * Create a new family inventory
   */
  const handleCreateFamily = async () => {
    if (!memberName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to create a family inventory.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setJoinError("");

    try {
      // Generate unique family ID
      const newFamilyId = generateFamilyId();
      
      // Check if Firebase is configured
      if (!firebaseFamilyService.isConfigured()) {
        toast({
          title: "Firebase Configuration Required",
          description: "Please configure Firebase credentials to enable family sharing.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Create family in Firebase
      const success = await firebaseFamilyService.createFamily(newFamilyId, memberName.trim());
      
      if (success) {
        // Update local store
        setFamilyId(newFamilyId);
        setStoreMemberName(memberName.trim());
        
        // Initialize real-time sync
        await initializeFamilySync(newFamilyId, memberName.trim());
        
        // Show success state
        setCreatedFamilyId(newFamilyId);
        setShowSuccess(true);
        
        toast({
          title: "Family Created Successfully",
          description: `Family ID: ${newFamilyId}. Share this with family members to join.`,
          duration: 8000
        });
      } else {
        throw new Error("Failed to create family in Firebase");
      }
    } catch (error) {
      console.error('Error creating family:', error);
      toast({
        title: "Failed to Create Family",
        description: "Unable to create family inventory. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Join an existing family inventory
   */
  const handleJoinFamily = async () => {
    if (!joinMemberName.trim()) {
      setJoinError("Please enter your name");
      return;
    }
    
    if (!familyCode.trim() || familyCode.length < 6) {
      setJoinError("Please enter a valid family code (at least 6 characters)");
      return;
    }

    setIsLoading(true);
    setJoinError("");

    try {
      // Check if Firebase is configured
      if (!firebaseFamilyService.isConfigured()) {
        toast({
          title: "Firebase Configuration Required",
          description: "Please configure Firebase credentials to enable family sharing.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Generate member ID
      const memberId = `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Join family in Firebase
      const success = await firebaseFamilyService.joinFamily(
        familyCode.trim().toUpperCase(), 
        joinMemberName.trim(), 
        memberId
      );
      
      if (success) {
        // Update local store
        setFamilyId(familyCode.trim().toUpperCase());
        setStoreMemberName(joinMemberName.trim());
        
        // Initialize real-time sync
        await initializeFamilySync(familyCode.trim().toUpperCase(), joinMemberName.trim());
        
        // Load existing family inventory
        await loadFamilyInventory(familyCode.trim().toUpperCase());
        
        toast({
          title: "Successfully Joined Family",
          description: `Welcome to the family inventory! Real-time sync is now active.`,
          duration: 5000
        });
        
        // Close modal
        onClose();
      } else {
        setJoinError("Family not found. Please check the family code and try again.");
      }
    } catch (error) {
      console.error('Error joining family:', error);
      setJoinError("Failed to join family. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Copy family ID to clipboard
   */
  const copyFamilyId = async () => {
    try {
      await navigator.clipboard.writeText(createdFamilyId);
      toast({
        title: "Family ID Copied",
        description: "Family ID has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy Failed",
        description: "Please manually copy the family ID.",
        variant: "destructive"
      });
    }
  };

  /**
   * Close modal and reset state
   */
  const handleClose = () => {
    setActiveTab("create");
    setMemberName("");
    setJoinMemberName("");
    setFamilyCode("");
    setJoinError("");
    setShowSuccess(false);
    setCreatedFamilyId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-purple-600" />
            Family Inventory Sharing
          </DialogTitle>
          <DialogDescription>
            Create or join a family inventory for real-time collaboration on medicine management.
          </DialogDescription>
        </DialogHeader>

        {/* Show current family status if already in a family */}
        {currentFamilyId && !showSuccess && (
          <Alert className="mb-4">
            <Users className="h-4 w-4" />
            <AlertDescription>
              Currently in family: <strong>{currentFamilyId}</strong> as <strong>{currentMemberName}</strong>
            </AlertDescription>
          </Alert>
        )}

        {showSuccess ? (
          /* Success State - Show created family ID */
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                Family inventory created successfully!
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label>Your Family ID</Label>
              <div className="flex gap-2">
                <Input 
                  value={createdFamilyId} 
                  readOnly 
                  className="font-mono text-lg text-center"
                />
                <Button variant="outline" size="icon" onClick={copyFamilyId}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this Family ID with family members so they can join your inventory.
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Start Managing Inventory
            </Button>
          </div>
        ) : (
          /* Main Interface - Create or Join Family */
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Family
              </TabsTrigger>
              <TabsTrigger value="join" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Join Family
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="memberName">Your Name</Label>
                <Input
                  id="memberName"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                onClick={handleCreateFamily} 
                disabled={isLoading || !memberName.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Family...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Family
                  </>
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                This will create a shared inventory that family members can join using a family code.
              </p>
            </TabsContent>

            <TabsContent value="join" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="joinMemberName">Your Name</Label>
                <Input
                  id="joinMemberName"
                  value={joinMemberName}
                  onChange={(e) => setJoinMemberName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyCode">Family Code</Label>
                <Input
                  id="familyCode"
                  value={familyCode}
                  onChange={(e) => {
                    setFamilyCode(e.target.value);
                    setJoinError("");
                  }}
                  placeholder="Enter family code (e.g., ABC12345)"
                  disabled={isLoading}
                  className="font-mono"
                />
              </div>

              {joinError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{joinError}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={handleJoinFamily} 
                disabled={isLoading || !joinMemberName.trim() || !familyCode.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Joining Family...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Join Family
                  </>
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                Get the family code from a family member who has already created the inventory.
              </p>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}