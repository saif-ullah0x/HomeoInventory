/**
 * Family Setup Component
 * Handles creating or joining a family for shared inventory management
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";
import { Users, Plus, UserPlus, Home } from "lucide-react";

interface FamilySetupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FamilySetup({ isOpen, onClose }: FamilySetupProps) {
  const [memberName, setMemberName] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setFamilyInfo, initializeFamilySync, loadFamilyInventory } = useStore();

  const createFamily = async () => {
    if (!memberName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to create a family.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/family/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberName: memberName.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to create family');
      }

      const data = await response.json();
      
      // Set family info in store for future sync
      setFamilyInfo(data.familyId, memberName.trim());
      
      // Initialize real-time sync with family
      await initializeFamilySync(data.familyId, memberName.trim());
      
      // Load family inventory (initially empty for new family)
      await loadFamilyInventory(data.familyId);
      
      toast({
        title: "Family Created!",
        description: `Your family ID is: ${data.familyId}. Share this with family members for inventory access.`,
      });

      onClose();
    } catch (error) {
      console.error('Error creating family:', error);
      toast({
        title: "Error",
        description: "Failed to create family. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinFamily = async () => {
    if (!memberName.trim() || !familyId.trim()) {
      toast({
        title: "Information Required",
        description: "Please enter both your name and the family ID.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/family/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          familyId: familyId.trim(), 
          memberName: memberName.trim() 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join family');
      }

      // Set family info in store for future sync
      setFamilyInfo(familyId.trim(), memberName.trim());
      
      // Initialize real-time sync with family
      await initializeFamilySync(familyId.trim(), memberName.trim());
      
      // Load existing family inventory
      await loadFamilyInventory(familyId.trim());

      toast({
        title: "Joined Family!",
        description: "You have successfully joined the family inventory and can now see shared medicines.",
      });

      onClose();
    } catch (error) {
      console.error('Error joining family:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join family. Please check the family ID and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Family Inventory Setup
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Set up shared medicine inventory for your family. All changes sync automatically across all family members.
          </p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Family
            </TabsTrigger>
            <TabsTrigger value="join" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Join Family
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="create-name">Your Name</Label>
              <Input
                id="create-name"
                placeholder="Enter your name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={createFamily} 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              {isLoading ? "Creating..." : "Create Family"}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Create a new family inventory and get a family ID to share with others.
            </div>
          </TabsContent>
          
          <TabsContent value="join" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="join-name">Your Name</Label>
              <Input
                id="join-name"
                placeholder="Enter your name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="family-id">Family ID</Label>
              <Input
                id="family-id"
                placeholder="Enter family ID (e.g., ABC12345)"
                value={familyId}
                onChange={(e) => setFamilyId(e.target.value.toUpperCase())}
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={joinFamily} 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              {isLoading ? "Joining..." : "Join Family"}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Join an existing family using the family ID shared with you.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}