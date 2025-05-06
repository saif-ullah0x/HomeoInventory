import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Medicine } from "@/lib/store";

type DuplicateAction = 'merge' | 'keep-both' | 'skip';

interface DuplicateMedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  existingMedicine: Medicine;
  newMedicine: {
    name: string;
    potency: string;
    company: string;
    location: string;
    subLocation?: string;
    bottleSize?: string;
    quantity: number;
  };
  onAction: (action: DuplicateAction) => void;
}

export default function DuplicateMedicineDialog({
  isOpen,
  onClose,
  existingMedicine,
  newMedicine,
  onAction
}: DuplicateMedicineDialogProps) {
  const [action, setAction] = useState<DuplicateAction>('merge');

  const handleAction = () => {
    onAction(action);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Duplicate Medicine Found</DialogTitle>
          <DialogDescription>
            This medicine already exists in your inventory. Please choose how you want to proceed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 p-3 border rounded-md">
              <h3 className="text-sm font-semibold">Existing Medicine</h3>
              <p className="text-sm">{existingMedicine.name} ({existingMedicine.potency})</p>
              <p className="text-xs text-muted-foreground">
                Qty: {existingMedicine.quantity} | {existingMedicine.company}, {existingMedicine.location}
              </p>
              {existingMedicine.subLocation && (
                <p className="text-xs text-muted-foreground">
                  Sub-location: {existingMedicine.subLocation}
                </p>
              )}
              {existingMedicine.bottleSize && (
                <p className="text-xs text-muted-foreground">
                  Bottle size: {existingMedicine.bottleSize}
                </p>
              )}
            </div>
            
            <div className="space-y-2 p-3 border rounded-md">
              <h3 className="text-sm font-semibold">New Medicine</h3>
              <p className="text-sm">{newMedicine.name} ({newMedicine.potency})</p>
              <p className="text-xs text-muted-foreground">
                Qty: {newMedicine.quantity} | {newMedicine.company}, {newMedicine.location}
              </p>
              {newMedicine.subLocation && (
                <p className="text-xs text-muted-foreground">
                  Sub-location: {newMedicine.subLocation}
                </p>
              )}
              {newMedicine.bottleSize && (
                <p className="text-xs text-muted-foreground">
                  Bottle size: {newMedicine.bottleSize}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Choose an action:</h3>
            <RadioGroup value={action} onValueChange={(value) => setAction(value as DuplicateAction)}>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="merge" id="merge" />
                <Label htmlFor="merge" className="cursor-pointer">
                  <span className="font-medium">Merge quantities</span>
                  <p className="text-sm text-muted-foreground">
                    Add the new quantity to the existing medicine ({existingMedicine.quantity} + {newMedicine.quantity} = {existingMedicine.quantity + newMedicine.quantity})
                  </p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="keep-both" id="keep-both" />
                <Label htmlFor="keep-both" className="cursor-pointer">
                  <span className="font-medium">Keep both</span>
                  <p className="text-sm text-muted-foreground">
                    Add as a separate medicine (create duplicate)
                  </p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="skip" id="skip" />
                <Label htmlFor="skip" className="cursor-pointer">
                  <span className="font-medium">Skip</span>
                  <p className="text-sm text-muted-foreground">
                    Don't add the new medicine
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAction}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}