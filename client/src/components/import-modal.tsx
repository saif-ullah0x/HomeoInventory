import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Medicine } from "@/lib/store";
import * as XLSX from 'xlsx';
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const addMedicine = useStore((state) => state.addMedicine);
  
  const handleFileUpload = (file: File) => {
    setError(null);
    
    // Check if it's an Excel file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new Error("Failed to read file");
        }
        
        // Parse Excel file
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        if (jsonData.length === 0) {
          setError("The uploaded file does not contain any data");
          return;
        }
        
        // Validate and add medicines
        let importCount = 0;
        let errorCount = 0;
        
        jsonData.forEach((row) => {
          try {
            // Map fields with various possible column names
            const medicineName = row['Medicine Name'] || row['Name'] || row['MedicineName'] || row['Medicine'];
            const potency = row['Potency'];
            const company = row['Company'];
            const location = row['Location'];
            const subLocation = row['Sub Location'] || row['SubLocation'] || row['Sub-Location'];
            const bottleSize = row['Bottle Size'] || row['BottleSize'];
            const quantity = typeof row['Quantity'] === 'number' ? row['Quantity'] : parseInt(row['Quantity'] || "1");
            
            // At minimum we need name, potency, company and location
            if (!medicineName || !potency || !company || !location) {
              errorCount++;
              return;
            }
            
            // Add to store
            addMedicine({
              name: medicineName,
              potency: potency,
              company: company,
              location: location,
              subLocation: subLocation || "",
              bottleSize: bottleSize || "",
              quantity: isNaN(quantity) ? 1 : quantity
            });
            
            importCount++;
          } catch (err) {
            errorCount++;
          }
        });
        
        // Show success or partial success
        if (importCount > 0) {
          toast({
            title: "Import successful",
            description: `Successfully imported ${importCount} medicines${errorCount > 0 ? ` (${errorCount} failed)` : ''}.`
          });
          onClose();
        } else {
          setError("Could not import any medicines. Check the file format.");
        }
        
      } catch (err) {
        console.error("Import error:", err);
        setError("Failed to process the Excel file. Please ensure it's properly formatted.");
      }
    };
    
    reader.onerror = () => {
      setError("Error reading the file. Please try again.");
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = () => {
    setDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Medicines from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx) with your medicine inventory.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div 
          className={`mt-4 p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer
            ${dragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx,.xls" 
            onChange={handleFileInputChange}
          />
          <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-center font-medium">
            Drop your Excel file here or click to browse
          </p>
          <p className="text-center text-sm text-muted-foreground mt-1">
            File must contain columns: Medicine Name, Potency, Company, Location
          </p>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}