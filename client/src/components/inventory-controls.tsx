import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, FileDown, FileUp, Users } from "lucide-react";
import { useStore } from "@/lib/store";

interface InventoryControlsProps {
  onAddClick: () => void;
  onImportClick: () => void;
  onExportToPDF: () => void;
  onExportToExcel: () => void;
  onShareClick?: () => void;
  onSearchChange: (value: string) => void;
  onLocationFilterChange: (value: string) => void;
  onCompanyFilterChange: (value: string) => void;
  searchTerm: string;
  locationFilter: string;
  companyFilter: string;
}

export default function InventoryControls({
  onAddClick,
  onImportClick,
  onExportToPDF,
  onExportToExcel,
  onShareClick,
  onSearchChange,
  onLocationFilterChange,
  onCompanyFilterChange,
  searchTerm,
  locationFilter,
  companyFilter,
}: InventoryControlsProps) {
  // Memoize the selectors to prevent infinite re-renders
  const getUniqueLocations = useStore((state) => state.getUniqueLocations);
  const getUniqueCompanies = useStore((state) => state.getUniqueCompanies);
  
  const locations = getUniqueLocations();
  const companies = getUniqueCompanies();
  
  // Add global click handler to close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('export-dropdown');
      const exportButton = document.getElementById('export-button');
      
      if (dropdown && !dropdown.classList.contains('hidden') && 
          !dropdown.contains(event.target as Node) && 
          exportButton && !exportButton.contains(event.target as Node)) {
        dropdown.classList.add('hidden');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="md:w-1/3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
          <Input
            type="text"
            placeholder="Search medicines..."
            className="pl-10 py-6 rounded-xl bg-white/80 dark:bg-gray-900/50 border-purple-100/50 dark:border-purple-900/30 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent hover:border-purple-300 glass-effect text-gray-700 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              boxShadow: searchTerm 
                ? "0 0 20px rgba(168, 85, 247, 0.4)" 
                : "0 0 10px rgba(168, 85, 247, 0.1)"
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={locationFilter} onValueChange={onLocationFilterChange}>
          <SelectTrigger className="w-[140px] premium-glow glass-effect transition-all duration-300">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_locations">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={companyFilter} onValueChange={onCompanyFilterChange}>
          <SelectTrigger className="w-[140px] premium-glow glass-effect transition-all duration-300">
            <SelectValue placeholder="All Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_companies">All Companies</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Button 
            id="export-button"
            variant="outline"
            onClick={() => {
              const dropdown = document.getElementById('export-dropdown');
              if (dropdown) {
                dropdown.classList.toggle('hidden');
              }
            }}
            className="gap-2 premium-simple-button smooth-transition"
          >
            <FileUp className="h-4 w-4" />
            Export
          </Button>
          <div 
            id="export-dropdown" 
            className="hidden absolute top-full mt-1 right-0 bg-background border border-border rounded-md shadow-lg z-10 min-w-[120px] py-1 glass-effect"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <div 
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('export-dropdown')?.classList.add('hidden');
                onExportToPDF();
              }} 
              className="block w-full text-left px-4 py-2 text-sm hover:bg-muted cursor-pointer smooth-transition"
            >
              PDF
            </div>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('export-dropdown')?.classList.add('hidden');
                onExportToExcel();
              }} 
              className="block w-full text-left px-4 py-2 text-sm hover:bg-muted cursor-pointer smooth-transition"
            >
              Excel
            </div>
          </div>
        </div>

        <Button 
          variant="outline"
          onClick={onImportClick} 
          className="gap-2 premium-simple-button button-press premium-glow transition-all duration-300"
        >
          <FileDown className="h-4 w-4" />
          Import
        </Button>

        <Button 
          onClick={onAddClick} 
          className="gap-2 premium-gradient-button bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white border-0 premium-glow button-press transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
}