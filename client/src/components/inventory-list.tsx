import React, { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2 } from "lucide-react";
import { type Medicine } from "@/lib/store";
import BulkActions from "@/components/bulk-actions";

interface InventoryListProps {
  medicines: Medicine[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function InventoryList({ medicines, onEdit, onDelete }: InventoryListProps) {
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  
  const getStatusBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>;
    }
  };
  
  const toggleMedicineSelection = (medicine: Medicine) => {
    if (selectedMedicines.some(m => m.id === medicine.id)) {
      setSelectedMedicines(selectedMedicines.filter(m => m.id !== medicine.id));
    } else {
      setSelectedMedicines([...selectedMedicines, medicine]);
    }
    
    // If no medicines are selected anymore, exit select mode
    if (selectedMedicines.length === 1) {
      setSelectMode(false);
    }
  };
  
  const handleBulkSelectionChange = (selected: boolean, medicines: Medicine[]) => {
    // For now, just showing all medicines as selected when "Select All" is clicked
    if (selected) {
      setSelectedMedicines(medicines);
    }
  };
  
  const clearSelection = () => {
    setSelectedMedicines([]);
    setSelectMode(false);
  };
  
  // Long press detection to enter select mode on mobile
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleTouchStart = (medicine: Medicine) => {
    longPressTimerRef.current = setTimeout(() => {
      setSelectMode(true);
      toggleMedicineSelection(medicine);
    }, 600); // 600ms for long press
  };
  
  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <div className="relative">
      <div className="bg-card shadow-sm overflow-hidden rounded-lg mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                {/* Show checkbox header when in select mode */}
                {selectMode && (
                  <Checkbox
                    checked={selectedMedicines.length === medicines.length && medicines.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMedicines([...medicines]);
                      } else {
                        setSelectedMedicines([]);
                      }
                    }}
                    aria-label="Select all"
                  />
                )}
              </TableHead>
              <TableHead>Medicine Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((medicine) => (
              <TableRow 
                key={medicine.id}
                className={selectMode ? "cursor-pointer hover:bg-muted/50" : undefined}
                onClick={selectMode ? () => toggleMedicineSelection(medicine) : undefined}
                onTouchStart={() => handleTouchStart(medicine)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                data-state={selectedMedicines.some(m => m.id === medicine.id) ? "selected" : ""}
              >
                <TableCell className="w-[50px]">
                  {selectMode && (
                    <Checkbox
                      checked={selectedMedicines.some(m => m.id === medicine.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedMedicines([...selectedMedicines, medicine]);
                        } else {
                          setSelectedMedicines(selectedMedicines.filter(m => m.id !== medicine.id));
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${medicine.name}`}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{medicine.name}</div>
                  <div className="text-sm text-muted-foreground">{medicine.potency}</div>
                  {medicine.bottleSize && (
                    <div className="text-xs text-muted-foreground">{medicine.bottleSize}</div>
                  )}
                </TableCell>
                <TableCell>{medicine.company}</TableCell>
                <TableCell>
                  <div>{medicine.location}</div>
                  {medicine.subLocation && (
                    <div className="text-sm text-muted-foreground">{medicine.subLocation}</div>
                  )}
                </TableCell>
                <TableCell>{medicine.quantity}</TableCell>
                <TableCell>{getStatusBadge(medicine.quantity)}</TableCell>
                <TableCell className="text-right">
                  {!selectMode && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(medicine.id);
                        }}
                        className="text-secondary h-8 w-8 p-0 mr-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(medicine.id);
                        }}
                        className="text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {!selectMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectMode(true);
                        toggleMedicineSelection(medicine);
                      }}
                      className="text-primary h-8 w-8 p-0 lg:hidden"
                    >
                      <span className="h-4 w-4 rounded-sm border border-primary flex items-center justify-center">
                        <span className="sr-only">Select {medicine.name}</span>
                      </span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Floating button to enter select mode */}
      {!selectMode && medicines.length > 0 && (
        <Button
          onClick={() => setSelectMode(true)}
          className="fixed bottom-4 right-4 z-10 rounded-full shadow-lg hidden lg:flex"
          size="sm"
        >
          <span className="mr-2">Select Items</span>
          <span className="h-4 w-4 rounded-sm border border-white flex items-center justify-center">
            <span className="sr-only">Enable selection mode</span>
          </span>
        </Button>
      )}
      
      {/* Bulk Actions component */}
      {selectedMedicines.length > 0 && (
        <BulkActions
          selectedMedicines={selectedMedicines}
          onClearSelection={clearSelection}
          onSelectionChange={handleBulkSelectionChange}
        />
      )}
    </div>
  );
}
