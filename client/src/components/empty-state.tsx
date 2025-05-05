import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface EmptyStateProps {
  onAddClick: () => void;
}

export default function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-card shadow-sm rounded-lg">
      <Package className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No medicines in your inventory</h3>
      <p className="mt-2 text-sm text-muted-foreground">Get started by adding your first medicine.</p>
      <div className="mt-6">
        <Button onClick={onAddClick}>
          Add Medicine
        </Button>
      </div>
    </div>
  );
}
