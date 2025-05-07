import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, FileDown, FileUp } from "lucide-react";
import { useStore } from "@/lib/store";

interface InventoryControlsProps {
  onAddClick: () => void;
  onImportClick: () => void;
  onExportToPDF: () => void;
  onExportToExcel: () => void;
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

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="md:w-1/3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search medicines..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={locationFilter} onValueChange={onLocationFilterChange}>
          <SelectTrigger className="w-[140px]">
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
          <SelectTrigger className="w-[140px]">
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

        <Button 
          variant="outline"
          onClick={onExportToPDF} 
          className="gap-2"
        >
          <FileDown className="h-4 w-4" />
          Export
        </Button>

        <Button 
          variant="outline"
          onClick={onImportClick} 
          className="gap-2"
        >
          <FileUp className="h-4 w-4" />
          Import
        </Button>

        <Button 
          onClick={onAddClick} 
          className="gap-2 button-hover-effect glow-effect"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
}