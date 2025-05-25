import { Button } from "@/components/ui/button";
import { Package, Search } from "lucide-react";

interface EmptyStateProps {
  onAddClick: () => void;
  isSearching?: boolean;
  searchTerm?: string;
}

export default function EmptyState({ onAddClick, isSearching = false, searchTerm = "" }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 bg-gradient-to-b from-white/80 to-white/30 dark:from-gray-900/80 dark:to-gray-900/30 backdrop-blur-md shadow-lg rounded-xl border border-purple-100/30 dark:border-purple-900/30 glass-effect">
      <div className="flex justify-center">
        {isSearching ? (
          <div className="w-20 h-20 rounded-full bg-purple-100/70 dark:bg-purple-900/20 flex items-center justify-center shadow-inner mb-4">
            <Search className="h-10 w-10 text-purple-500 dark:text-purple-400 opacity-90" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-purple-100/70 dark:bg-purple-900/20 flex items-center justify-center shadow-inner mb-4">
            <Package className="h-10 w-10 text-purple-500 dark:text-purple-400 opacity-90" />
          </div>
        )}
      </div>
      
      {isSearching ? (
        <>
          <h3 className="mt-6 text-xl font-medium bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">No results found</h3>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            No medicines matching "<span className="font-medium">{searchTerm}</span>" were found in your inventory.
          </p>
          <div className="mt-8">
            <Button 
              onClick={onAddClick}
              className="premium-gradient-button bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white px-6 py-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
            >
              Add New Medicine
            </Button>
          </div>
        </>
      ) : (
        <>
          <h3 className="mt-6 text-xl font-medium bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">No medicines in your inventory</h3>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Get started by adding your first medicine.</p>
          <div className="mt-8">
            <Button 
              onClick={onAddClick}
              className="premium-gradient-button bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white px-6 py-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
            >
              Add Medicine
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
