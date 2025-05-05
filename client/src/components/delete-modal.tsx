import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicineId: number | null;
}

export default function DeleteModal({ isOpen, onClose, medicineId }: DeleteModalProps) {
  const { toast } = useToast();
  const deleteMedicine = useStore((state) => state.deleteMedicine);
  const getMedicineById = useStore((state) => state.getMedicineById);
  
  const medicine = medicineId !== null ? getMedicineById(medicineId) : null;
  
  const handleDelete = () => {
    if (medicineId !== null) {
      try {
        deleteMedicine(medicineId);
        toast({
          title: "Medicine deleted",
          description: "The medicine has been removed from your inventory."
        });
        onClose();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete medicine. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {medicine ? `${medicine.name} (${medicine.potency})` : "this medicine"}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
