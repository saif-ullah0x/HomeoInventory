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
    
    // Check if it's an Excel or CSV file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      setError("Please upload an Excel file (.xlsx or .xls) or CSV file (.csv)");
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new Error("Failed to read file");
        }
        
        // Parse file
        let workbook, worksheet, jsonData;
        
        try {
          if (file.name.endsWith('.csv')) {
            // For CSV files, we need to read as string
            if (typeof e.target.result !== 'string') {
              // If we got an ArrayBuffer for a CSV file, convert it to string
              const buffer = e.target.result as ArrayBuffer;
              const decoder = new TextDecoder('utf-8');
              const csvData = decoder.decode(buffer);
              workbook = XLSX.read(csvData, { type: 'string' });
            } else {
              // If we already have a string
              workbook = XLSX.read(e.target.result, { type: 'string' });
            }
          } else {
            // Parse Excel data - this needs ArrayBuffer
            if (typeof e.target.result === 'string') {
              // If we somehow got a string for an Excel file, this is unlikely but let's handle it
              setError("Could not process Excel file correctly. Please try again.");
              return;
            } else {
              const data = new Uint8Array(e.target.result as ArrayBuffer);
              workbook = XLSX.read(data, { type: 'array' });
            }
          }
        } catch (readError) {
          console.error("Error reading file:", readError);
          
          // Try an alternative method
          try {
            const data = e.target.result;
            if (typeof data === 'string') {
              workbook = XLSX.read(data, { type: 'string' });
            } else {
              const buffer = new Uint8Array(data as ArrayBuffer);
              workbook = XLSX.read(buffer, { type: 'array' });
            }
          } catch (fallbackError) {
            console.error("Fallback reading failed:", fallbackError);
            setError("Could not read the file format. Please ensure it's a valid Excel or CSV file.");
            return;
          }
        }
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        if (jsonData.length === 0) {
          setError("The uploaded file does not contain any data");
          return;
        }
        
        // Validate and add medicines
        let importCount = 0;
        let errorCount = 0;
        
        jsonData.forEach((row) => {
          try {
            // Get all row keys
            const keys = Object.keys(row);
            
            // Try to smartly detect fields from the headers or combined values
            const possibleNameKeys = ['medicine name', 'name', 'medicinename', 'medicine', 'drug name', 'drug'];
            const possiblePotencyKeys = ['potency', 'potencies', 'strength', 'dilution'];
            const possibleCompanyKeys = ['company', 'manufacturer', 'brand', 'lab', 'vendor', 'supplier'];
            const possibleLocationKeys = ['location', 'place', 'storage', 'cabinet', 'shelf'];
            const possibleSubLocationKeys = ['sub location', 'sublocation', 'sub-location', 'drawer', 'compartment'];
            const possibleBottleSizeKeys = ['bottle size', 'bottlesize', 'size', 'volume', 'container size'];
            const possibleQuantityKeys = ['quantity', 'qty', 'count', 'number', 'amount', 'stock'];
            
            // Find columns that match our expected fields using case-insensitive comparison
            let medicineName = '';
            let potency = '';
            let company = '';
            let location = '';
            let subLocation = '';
            let bottleSize = '';
            let quantity = 1;
            
            // Try to find medicine name and potency, which might be combined
            for (const key of keys) {
              const lowerKey = key.toLowerCase();
              
              // Look for medicine name
              if (possibleNameKeys.some(k => lowerKey.includes(k))) {
                let val = row[key].toString().trim();
                
                // Check if name contains potency (like "Arnica 30")
                const potencyMatch = val.match(/\s+(\d+[cxCX]?|[qQcCxX]|LM\d+|MM?|CM)$/);
                if (potencyMatch) {
                  // Split name and potency
                  potency = potencyMatch[1];
                  medicineName = val.substring(0, val.length - potencyMatch[0].length).trim();
                } else {
                  medicineName = val;
                }
                continue;
              }
              
              // Handle potency if not already found in name
              if (potency === '' && possiblePotencyKeys.some(k => lowerKey.includes(k))) {
                potency = row[key].toString().trim();
                continue;
              }
              
              // Handle company
              if (possibleCompanyKeys.some(k => lowerKey.includes(k))) {
                company = row[key].toString().trim();
                continue;
              }
              
              // Handle location
              if (possibleLocationKeys.some(k => lowerKey.includes(k))) {
                location = row[key].toString().trim();
                continue;
              }
              
              // Handle sub-location
              if (possibleSubLocationKeys.some(k => lowerKey.includes(k))) {
                subLocation = row[key].toString().trim();
                continue;
              }
              
              // Handle bottle size
              if (possibleBottleSizeKeys.some(k => lowerKey.includes(k))) {
                bottleSize = row[key].toString().trim();
                continue;
              }
              
              // Handle quantity
              if (possibleQuantityKeys.some(k => lowerKey.includes(k))) {
                const qtyValue = row[key];
                quantity = typeof qtyValue === 'number' ? qtyValue : parseInt(qtyValue.toString() || "1");
                quantity = isNaN(quantity) ? 1 : quantity;
                continue;
              }
            }
            
            // If we couldn't find name/potency/location, try to use general columns by position
            if (!medicineName && keys.length > 0) medicineName = row[keys[0]].toString().trim();
            if (!potency && keys.length > 1) potency = row[keys[1]].toString().trim();
            if (!company && keys.length > 2) company = row[keys[2]].toString().trim();
            if (!location && keys.length > 3) location = row[keys[3]].toString().trim();
            
            // Fallback for common company names
            if (!company) {
              const commonCompanies = ['SBL', 'Schwabe', 'Masood', 'Kent', 'Reckeweg', 'Boiron', 'Willmar Schwabe', 'Allen', 'BJAIN', 'Bakson', 'Adel', 'Wheezal', 'Lords'];
              for (const value of Object.values(row)) {
                const strValue = value?.toString()?.trim() || '';
                if (commonCompanies.some(c => strValue.includes(c))) {
                  company = strValue;
                  break;
                }
              }
            }
            
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
              quantity: quantity
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
          <DialogTitle>Import Your Medicine Inventory</DialogTitle>
          <DialogDescription>
            Upload your Excel (.xlsx/.xls) or CSV (.csv) file with medicine details.
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
            accept=".xlsx,.xls,.csv" 
            onChange={handleFileInputChange}
          />
          <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-center font-medium">
            Drop your Excel or CSV file here or click to browse
          </p>
          <p className="text-center text-sm text-muted-foreground mt-1">
            File should contain medicine details - we'll try to automatically detect column formats
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