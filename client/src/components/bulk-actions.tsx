import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  ChevronDown, 
  Trash, 
  PackagePlus, 
  PackageMinus, 
  EditIcon, 
  XCircle,
  MapPin,
  Building,
  Package
} from "lucide-react";
import { useStore, Medicine } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { POTENCIES, DEFAULT_LOCATIONS, DEFAULT_COMPANIES, BOTTLE_SIZES } from "@/lib/data";

interface BulkActionsProps {
  selectedMedicines: Medicine[];
  onClearSelection: () => void;
  onSelectionChange: (selected: boolean, medicines: Medicine[]) => void;
}

export default function BulkActions({ 
  selectedMedicines, 
  onClearSelection,
  onSelectionChange
}: BulkActionsProps) {
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showBulkQuantityDialog, setShowBulkQuantityDialog] = useState(false);
  const [showBulkLocationDialog, setShowBulkLocationDialog] = useState(false);
  const [showBulkCompanyDialog, setShowBulkCompanyDialog] = useState(false);
  const [showBulkPotencyDialog, setShowBulkPotencyDialog] = useState(false);
  const [showBulkBottleSizeDialog, setShowBulkBottleSizeDialog] = useState(false);
  
  const [quantityChangeAmount, setQuantityChangeAmount] = useState(1);
  const [quantityAction, setQuantityAction] = useState<'add' | 'subtract'>('add');
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedPotency, setSelectedPotency] = useState<string>("");
  const [selectedBottleSize, setSelectedBottleSize] = useState<string>("");
  const [selectedSubLocation, setSelectedSubLocation] = useState<string>("");
  
  const { toast } = useToast();
  const updateMedicine = useStore((state) => state.updateMedicine);
  const deleteMedicine = useStore((state) => state.deleteMedicine);
  
  const handleBulkDelete = () => {
    try {
      selectedMedicines.forEach(medicine => {
        deleteMedicine(medicine.id);
      });
      
      toast({
        title: "Medicines deleted",
        description: `Successfully deleted ${selectedMedicines.length} medicine(s)`,
      });
      
      onClearSelection();
      setShowBulkDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete medicines. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleBulkQuantityChange = () => {
    try {
      selectedMedicines.forEach(medicine => {
        const newQuantity = quantityAction === 'add' 
          ? medicine.quantity + quantityChangeAmount
          : Math.max(0, medicine.quantity - quantityChangeAmount);
        
        updateMedicine(medicine.id, {
          ...medicine,
          quantity: newQuantity
        });
      });
      
      toast({
        title: "Quantities updated",
        description: `Successfully updated quantities for ${selectedMedicines.length} medicine(s)`,
      });
      
      onClearSelection();
      setShowBulkQuantityDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantities. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleBulkLocationChange = () => {
    if (!selectedLocation) {
      toast({
        title: "Selection required",
        description: "Please select a location",
        variant: "destructive",
      });
      return;
    }
    
    try {
      selectedMedicines.forEach(medicine => {
        updateMedicine(medicine.id, {
          ...medicine,
          location: selectedLocation,
          subLocation: selectedSubLocation || medicine.subLocation
        });
      });
      
      toast({
        title: "Locations updated",
        description: `Successfully updated locations for ${selectedMedicines.length} medicine(s)`,
      });
      
      onClearSelection();
      setShowBulkLocationDialog(false);
      setSelectedLocation("");
      setSelectedSubLocation("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update locations. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleBulkCompanyChange = () => {
    if (!selectedCompany) {
      toast({
        title: "Selection required",
        description: "Please select a company",
        variant: "destructive",
      });
      return;
    }
    
    try {
      selectedMedicines.forEach(medicine => {
        updateMedicine(medicine.id, {
          ...medicine,
          company: selectedCompany
        });
      });
      
      toast({
        title: "Companies updated",
        description: `Successfully updated companies for ${selectedMedicines.length} medicine(s)`,
      });
      
      onClearSelection();
      setShowBulkCompanyDialog(false);
      setSelectedCompany("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update companies. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleBulkPotencyChange = () => {
    if (!selectedPotency) {
      toast({
        title: "Selection required",
        description: "Please select a potency",
        variant: "destructive",
      });
      return;
    }
    
    try {
      selectedMedicines.forEach(medicine => {
        updateMedicine(medicine.id, {
          ...medicine,
          potency: selectedPotency
        });
      });
      
      toast({
        title: "Potencies updated",
        description: `Successfully updated potencies for ${selectedMedicines.length} medicine(s)`,
      });
      
      onClearSelection();
      setShowBulkPotencyDialog(false);
      setSelectedPotency("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update potencies. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSelectAll = () => {
    // We don't have direct access to all medicines here,
    // so we inform the parent component to handle the selection
    onSelectionChange(true, selectedMedicines);
  };
  
  const handleDeselectAll = () => {
    onClearSelection();
  };

  if (selectedMedicines.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border border-border shadow-lg rounded-lg px-4 py-3 z-10 flex items-center gap-2 max-w-[90%] sm:max-w-[500px]">
        <span className="text-sm font-medium mr-2">
          {selectedMedicines.length} selected
        </span>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setShowBulkQuantityDialog(true)}
          className="gap-1"
        >
          <EditIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Quantity</span>
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setShowBulkDeleteDialog(true)}
          className="gap-1 text-destructive hover:text-destructive"
        >
          <Trash className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1">
              <span>More</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowBulkLocationDialog(true)}>
              <MapPin className="h-4 w-4 mr-2" />
              Change Location
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowBulkCompanyDialog(true)}>
              <Building className="h-4 w-4 mr-2" />
              Change Company
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowBulkPotencyDialog(true)}>
              <Package className="h-4 w-4 mr-2" />
              Change Potency
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSelectAll}>
              Select All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeselectAll}>
              Deselect All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onClearSelection}
          className="ml-auto"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Medicines</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedMedicines.length} selected medicine(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[200px] overflow-y-auto">
            <ul className="space-y-1">
              {selectedMedicines.map(medicine => (
                <li key={medicine.id} className="text-sm">
                  {medicine.name} ({medicine.potency}) - Qty: {medicine.quantity}
                </li>
              ))}
            </ul>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete {selectedMedicines.length} Medicine(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Quantity Change Dialog */}
      <Dialog open={showBulkQuantityDialog} onOpenChange={setShowBulkQuantityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Quantities</DialogTitle>
            <DialogDescription>
              Change quantities for {selectedMedicines.length} selected medicine(s).
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                type="button"
                variant={quantityAction === 'add' ? 'default' : 'outline'}
                onClick={() => setQuantityAction('add')}
                className="w-full flex items-center gap-2"
              >
                <PackagePlus className="h-4 w-4" />
                Add
              </Button>
              <Button
                type="button"
                variant={quantityAction === 'subtract' ? 'default' : 'outline'}
                onClick={() => setQuantityAction('subtract')}
                className="w-full flex items-center gap-2"
              >
                <PackageMinus className="h-4 w-4" />
                Subtract
              </Button>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="quantity-change" className="text-sm font-medium">
                {quantityAction === 'add' ? 'Add' : 'Subtract'} quantity:
              </label>
              <Input
                id="quantity-change"
                type="number"
                min="1"
                value={quantityChangeAmount}
                onChange={(e) => setQuantityChangeAmount(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            
            <div className="mt-4 text-sm space-y-1">
              <p className="font-medium">This will affect:</p>
              <div className="max-h-[100px] overflow-y-auto pl-2">
                <ul className="space-y-1 list-disc pl-5">
                  {selectedMedicines.slice(0, 5).map(medicine => (
                    <li key={medicine.id}>
                      {medicine.name} ({medicine.potency})
                      {quantityAction === 'add' 
                        ? `: ${medicine.quantity} → ${medicine.quantity + quantityChangeAmount}`
                        : `: ${medicine.quantity} → ${Math.max(0, medicine.quantity - quantityChangeAmount)}`}
                    </li>
                  ))}
                  {selectedMedicines.length > 5 && (
                    <li>...and {selectedMedicines.length - 5} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkQuantityDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkQuantityChange}>
              Update Quantities
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Location Change Dialog */}
      <Dialog open={showBulkLocationDialog} onOpenChange={setShowBulkLocationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Locations</DialogTitle>
            <DialogDescription>
              Change locations for {selectedMedicines.length} selected medicine(s).
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location-select">Location</Label>
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger id="location-select">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_LOCATIONS.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sublocation-input">Sub-location (optional)</Label>
              <Input
                id="sublocation-input"
                placeholder="E.g., Top shelf, Drawer"
                value={selectedSubLocation}
                onChange={(e) => setSelectedSubLocation(e.target.value)}
              />
            </div>
            
            <div className="mt-4 text-sm space-y-1">
              <p className="font-medium">This will affect:</p>
              <div className="max-h-[100px] overflow-y-auto pl-2">
                <ul className="space-y-1 list-disc pl-5">
                  {selectedMedicines.slice(0, 5).map(medicine => (
                    <li key={medicine.id}>
                      {medicine.name} ({medicine.potency})
                      {selectedLocation ? 
                        `: ${medicine.location} → ${selectedLocation}` : 
                        `: ${medicine.location}`}
                    </li>
                  ))}
                  {selectedMedicines.length > 5 && (
                    <li>...and {selectedMedicines.length - 5} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkLocationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkLocationChange}>
              Update Locations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Company Change Dialog */}
      <Dialog open={showBulkCompanyDialog} onOpenChange={setShowBulkCompanyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Companies</DialogTitle>
            <DialogDescription>
              Change companies for {selectedMedicines.length} selected medicine(s).
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-select">Company</Label>
              <Select 
                value={selectedCompany} 
                onValueChange={setSelectedCompany}
              >
                <SelectTrigger id="company-select">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_COMPANIES.map(company => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-4 text-sm space-y-1">
              <p className="font-medium">This will affect:</p>
              <div className="max-h-[100px] overflow-y-auto pl-2">
                <ul className="space-y-1 list-disc pl-5">
                  {selectedMedicines.slice(0, 5).map(medicine => (
                    <li key={medicine.id}>
                      {medicine.name} ({medicine.potency})
                      {selectedCompany ? 
                        `: ${medicine.company} → ${selectedCompany}` : 
                        `: ${medicine.company}`}
                    </li>
                  ))}
                  {selectedMedicines.length > 5 && (
                    <li>...and {selectedMedicines.length - 5} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkCompanyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkCompanyChange}>
              Update Companies
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Potency Change Dialog */}
      <Dialog open={showBulkPotencyDialog} onOpenChange={setShowBulkPotencyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Potencies</DialogTitle>
            <DialogDescription>
              Change potencies for {selectedMedicines.length} selected medicine(s).
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="potency-select">Potency</Label>
              <Select 
                value={selectedPotency} 
                onValueChange={setSelectedPotency}
              >
                <SelectTrigger id="potency-select">
                  <SelectValue placeholder="Select potency" />
                </SelectTrigger>
                <SelectContent>
                  {POTENCIES.map(potency => (
                    <SelectItem key={potency} value={potency}>
                      {potency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-4 text-sm space-y-1">
              <p className="font-medium">This will affect:</p>
              <div className="max-h-[100px] overflow-y-auto pl-2">
                <ul className="space-y-1 list-disc pl-5">
                  {selectedMedicines.slice(0, 5).map(medicine => (
                    <li key={medicine.id}>
                      {medicine.name} 
                      {selectedPotency ? 
                        `: ${medicine.potency} → ${selectedPotency}` : 
                        `: ${medicine.potency}`}
                    </li>
                  ))}
                  {selectedMedicines.length > 5 && (
                    <li>...and {selectedMedicines.length - 5} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkPotencyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkPotencyChange}>
              Update Potencies
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}