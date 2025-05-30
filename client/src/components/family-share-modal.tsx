/**
 * Family Share Modal - Replaces old cloud storage sharing
 * Directs users to the proper family inventory system
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Plus, UserPlus, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FamilyShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFamily: () => void;
  onJoinFamily: () => void;
}

export default function FamilyShareModal({ 
  isOpen, 
  onClose, 
  onCreateFamily, 
  onJoinFamily 
}: FamilyShareModalProps) {
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center gap-2 justify-center">
            <Users className="h-5 w-5 text-purple-600" />
            Family Inventory Sharing
          </DialogTitle>
          <DialogDescription className="text-center">
            Share your medicine inventory with family members using our real-time family system.
          </DialogDescription>
        </DialogHeader>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            The old sharing system has been upgraded to a better family inventory system with real-time synchronization.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={() => {
                onClose();
                onCreateFamily();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create New Family
            </Button>
            
            <Button 
              onClick={() => {
                onClose();
                onJoinFamily();
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Join Existing Family
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <p className="font-medium mb-1">Family Inventory Benefits:</p>
              <ul className="text-xs space-y-1">
                <li>• Real-time updates across all family members</li>
                <li>• Instant sync when medicines are added or changed</li>
                <li>• No manual refresh needed</li>
                <li>• Secure family-only access</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}