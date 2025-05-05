import { Button } from "@/components/ui/button";
import { Package, Search } from "lucide-react";

interface EmptyStateProps {
  onAddClick: () => void;
  isSearching?: boolean;
  searchTerm?: string;
}

export default function EmptyState({ onAddClick, isSearching = false, searchTerm = "" }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-card shadow-sm rounded-lg">
      {isSearching ? (
        <>
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No results found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No medicines matching "{searchTerm}" were found in your inventory.
          </p>
          <div className="mt-6">
            <Button onClick={onAddClick}>
              Add New Medicine
            </Button>
          </div>
        </>
      ) : (
        <>
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No medicines in your inventory</h3>
          <p className="mt-2 text-sm text-muted-foreground">Get started by adding your first medicine.</p>
          <div className="mt-6">
            <Button onClick={onAddClick}>
              Add Medicine
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
