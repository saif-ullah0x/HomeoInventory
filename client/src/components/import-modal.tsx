import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, AlertCircle, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_COMPANIES, DEFAULT_LOCATIONS } from "@/lib/data";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportStep = 'upload' | 'mapping' | 'preview';

interface ColumnMapping {
  name: string | null;
  potency: string | null;
  company: string | null;
  location: string | null;
  subLocation: string | null;
  bottleSize: string | null;
  quantity: string | null;
}

interface PreviewItem {
  name: string;
  potency: string;
  company: string;
  location: string;
  subLocation?: string;
  bottleSize?: string;
  quantity: number;
  valid: boolean;
  error?: string;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<ImportStep>('upload');
  
  // File data
  const [fileName, setFileName] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [jsonData, setJsonData] = useState<any[]>([]);
  
  // Column mapping
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    name: null,
    potency: null,
    company: null,
    location: null,
    subLocation: null,
    bottleSize: null,
    quantity: null
  });
  
  // Preview data
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
  
  const addMedicine = useStore((state) => state.addMedicine);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('upload');
      setError(null);
      setHeaders([]);
      setJsonData([]);
      setColumnMapping({
        name: null,
        potency: null,
        company: null,
        location: null,
        subLocation: null,
        bottleSize: null,
        quantity: null
      });
      setPreviewItems([]);
      setFileName('');
    }
  }, [isOpen]);
  
  const processFile = (file: File) => {
    setError(null);
    setFileName(file.name);
    
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
        let workbook, worksheet, data;
        
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
        if (!firstSheetName) {
          setError("The uploaded file does not contain any sheets");
          return;
        }
        
        worksheet = workbook.Sheets[firstSheetName];
        if (!worksheet) {
          setError("Could not read sheet data from the uploaded file");
          return;
        }
        
        // Convert to JSON with header option to get column letters as keys
        data = XLSX.utils.sheet_to_json<any>(worksheet, { header: 'A' });
        
        if (!data || data.length === 0) {
          setError("The uploaded file appears to be empty");
          return;
        }
        
        // Extract headers (first row)
        const headerRow = data[0];
        const fileHeaders = Object.values(headerRow || {}).map(h => h?.toString() || '');
        
        // If no valid headers found, try to use the first row as data instead
        if (fileHeaders.length === 0 || fileHeaders.every(h => !h)) {
          setError("Could not detect column headers in your file. Please make sure the first row contains column names.");
          return;
        }
        
        // Remove header row from data
        const rowData = data.slice(1);
        
        // Show warning but allow proceeding if there's no data rows
        if (rowData.length === 0) {
          console.warn("The file appears to only contain headers without data rows");
          // We'll still proceed to mapping screen, but without preview data
        }
        
        setHeaders(fileHeaders);
        setJsonData(rowData);
        
        // Auto-detect column mappings
        const possibleNameKeys = ['medicine name', 'name', 'medicinename', 'medicine', 'drug name', 'drug'];
        const possiblePotencyKeys = ['potency', 'potencies', 'strength', 'dilution'];
        const possibleCompanyKeys = ['company', 'manufacturer', 'brand', 'lab', 'vendor', 'supplier'];
        const possibleLocationKeys = ['location', 'place', 'storage', 'cabinet', 'shelf', 'area'];
        const possibleSubLocationKeys = ['sub location', 'sublocation', 'sub-location', 'drawer', 'compartment'];
        const possibleBottleSizeKeys = ['bottle size', 'bottlesize', 'size', 'volume', 'container size'];
        const possibleQuantityKeys = ['quantity', 'qty', 'count', 'number', 'amount', 'stock', 'current quantity'];
        
        // Initialize auto-detected mapping
        const autoMapping: ColumnMapping = {
          name: null,
          potency: null,
          company: null,
          location: null,
          subLocation: null,
          bottleSize: null,
          quantity: null
        };
        
        // Try to auto-detect columns based on headers
        fileHeaders.forEach((header, index) => {
          const columnKey = String.fromCharCode(65 + index); // Convert index to A, B, C...
          const headerText = header.toLowerCase();
          
          if (possibleNameKeys.some(k => headerText.includes(k.toLowerCase()))) {
            autoMapping.name = columnKey;
          }
          else if (possiblePotencyKeys.some(k => headerText.includes(k.toLowerCase()))) {
            autoMapping.potency = columnKey;
          }
          else if (possibleCompanyKeys.some(k => headerText.includes(k.toLowerCase()))) {
            autoMapping.company = columnKey;
          }
          else if (possibleLocationKeys.some(k => headerText.includes(k.toLowerCase()))) {
            autoMapping.location = columnKey;
          }
          else if (possibleSubLocationKeys.some(k => headerText.includes(k.toLowerCase()))) {
            autoMapping.subLocation = columnKey;
          }
          else if (possibleBottleSizeKeys.some(k => headerText.includes(k.toLowerCase()))) {
            autoMapping.bottleSize = columnKey;
          }
          else if (possibleQuantityKeys.some(k => headerText.includes(k.toLowerCase()))) {
            autoMapping.quantity = columnKey;
          }
        });
        
        // If name and potency might be combined (e.g., "Arnica 30C"), check first few rows
        if (autoMapping.name && !autoMapping.potency) {
          const nameColumn = autoMapping.name;
          let hasCombinedPotency = false;
          
          // Check first 5 rows or all rows if less than 5
          const rowsToCheck = Math.min(5, rowData.length);
          for (let i = 0; i < rowsToCheck; i++) {
            const nameValue = rowData[i][nameColumn]?.toString() || '';
            if (nameValue.match(/\s+(\d+[cxCX]?|[qQcCxX]|LM\d+|MM?|CM)$/)) {
              hasCombinedPotency = true;
              break;
            }
          }
          
          if (hasCombinedPotency) {
            // We'll handle splitting in the preview generation
            console.log("Detected combined name and potency");
          }
        }
        
        setColumnMapping(autoMapping);
        setStep('mapping');
        
      } catch (err) {
        console.error("Import error:", err);
        setError("Failed to process the file. Please ensure it's properly formatted.");
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
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleColumnMappingChange = (field: keyof ColumnMapping, value: string | null) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: value === "" ? null : value
    }));
  };
  
  // Helper function to render column options consistently and safely
  const renderColumnOptions = () => {
    return (
      <>
        {headers.map((header, index) => {
          const colValue = String.fromCharCode(65 + index);
          return (
            <SelectItem key={index} value={colValue}>
              {header || `Column ${colValue}`}
            </SelectItem>
          );
        })}
      </>
    );
  };

  const generatePreview = () => {
    const preview: PreviewItem[] = [];
    
    // Process up to first 100 rows for preview
    const rowsToProcess = Math.min(jsonData.length, 100);
    
    for (let i = 0; i < rowsToProcess; i++) {
      const row = jsonData[i];
      const item: PreviewItem = {
        name: '',
        potency: '',
        company: '',
        location: '',
        subLocation: '',
        bottleSize: '',
        quantity: 1,
        valid: false
      };
      
      // Extract values based on mapping
      if (columnMapping.name) {
        let nameValue = row[columnMapping.name]?.toString()?.trim() || '';
        
        // Check if name has potency embedded (e.g., "Arnica 30C")
        const potencyMatch = nameValue.match(/\s+(\d+[cxCX]?|[qQcCxX]|LM\d+|MM?|CM)$/);
        if (potencyMatch && !columnMapping.potency) {
          // Split name and potency if potency column isn't mapped
          item.potency = potencyMatch[1];
          item.name = nameValue.substring(0, nameValue.length - potencyMatch[0].length).trim();
        } else {
          item.name = nameValue;
        }
      }
      
      if (columnMapping.potency) {
        item.potency = row[columnMapping.potency]?.toString()?.trim() || '';
      }
      
      if (columnMapping.company) {
        item.company = row[columnMapping.company]?.toString()?.trim() || '';
      }
      
      if (columnMapping.location) {
        item.location = row[columnMapping.location]?.toString()?.trim() || '';
      }
      
      if (columnMapping.subLocation) {
        item.subLocation = row[columnMapping.subLocation]?.toString()?.trim() || '';
      }
      
      if (columnMapping.bottleSize) {
        item.bottleSize = row[columnMapping.bottleSize]?.toString()?.trim() || '';
      }
      
      if (columnMapping.quantity) {
        const qtyValue = row[columnMapping.quantity];
        if (qtyValue !== undefined && qtyValue !== null) {
          const qty = typeof qtyValue === 'number' ? qtyValue : parseInt(qtyValue.toString() || "1");
          item.quantity = isNaN(qty) ? 1 : qty;
        }
      }
      
      // Validate required fields - only name is absolutely required
      // The other fields can be optionally required based on configuration
      if (!item.name) {
        item.valid = false;
        item.error = "Missing medicine name";
      } else {
        // Validation warnings for other fields
        if (!item.potency) {
          // If we have a column mapping for potency but it's empty, that's an error
          // If we don't have a column mapping, it's ok to be missing
          if (columnMapping.potency) {
            item.valid = false;
            item.error = "Missing potency";
          }
        }
        
        if (!item.company) {
          if (columnMapping.company) {
            item.valid = false;
            item.error = "Missing company";
          }
        }
        
        if (!item.location) {
          if (columnMapping.location) {
            item.valid = false;
            item.error = "Missing location";
          }
        }
        
        // If we haven't set valid to false by now, it's valid
        if (item.valid !== false) {
          item.valid = true;
        }
      }
      
      preview.push(item);
    }
    
    setPreviewItems(preview);
    setStep('preview');
  };

  const importMedicines = () => {
    // Count valid items
    const validCount = previewItems.filter(item => item.valid).length;
    
    if (validCount === 0) {
      setError("No valid medicines to import");
      return;
    }
    
    // Process all data rows (not just preview ones)
    let importCount = 0;
    let errorCount = 0;
    
    jsonData.forEach(row => {
      try {
        const item: PreviewItem = {
          name: '',
          potency: '',
          company: '',
          location: '',
          subLocation: '',
          bottleSize: '',
          quantity: 1,
          valid: false
        };
        
        // Extract values based on mapping (same logic as in generatePreview)
        if (columnMapping.name) {
          let nameValue = row[columnMapping.name]?.toString()?.trim() || '';
          
          // Check if name has potency embedded
          const potencyMatch = nameValue.match(/\s+(\d+[cxCX]?|[qQcCxX]|LM\d+|MM?|CM)$/);
          if (potencyMatch && !columnMapping.potency) {
            item.potency = potencyMatch[1];
            item.name = nameValue.substring(0, nameValue.length - potencyMatch[0].length).trim();
          } else {
            item.name = nameValue;
          }
        }
        
        if (columnMapping.potency) {
          item.potency = row[columnMapping.potency]?.toString()?.trim() || '';
        }
        
        if (columnMapping.company) {
          item.company = row[columnMapping.company]?.toString()?.trim() || '';
        }
        
        if (columnMapping.location) {
          item.location = row[columnMapping.location]?.toString()?.trim() || '';
        }
        
        if (columnMapping.subLocation) {
          item.subLocation = row[columnMapping.subLocation]?.toString()?.trim() || '';
        }
        
        if (columnMapping.bottleSize) {
          item.bottleSize = row[columnMapping.bottleSize]?.toString()?.trim() || '';
        }
        
        if (columnMapping.quantity) {
          const qtyValue = row[columnMapping.quantity];
          if (qtyValue !== undefined && qtyValue !== null) {
            const qty = typeof qtyValue === 'number' ? qtyValue : parseInt(qtyValue.toString() || "1");
            item.quantity = isNaN(qty) ? 1 : qty;
          }
        }
        
        // Only medicine name is absolutely required
        if (!item.name) {
          errorCount++;
          return; // Skip this row
        }
        
        // Set default values for optional fields
        if (!item.potency) {
          item.potency = "Unknown"; // Default potency if not provided
        }
        
        if (!item.company) {
          item.company = "Unknown"; // Default company if not provided
        }
        
        if (!item.location) {
          item.location = "Unknown"; // Default location if not provided
        }
        
        // Add to store
        addMedicine({
          name: item.name,
          potency: item.potency,
          company: item.company,
          location: item.location,
          subLocation: item.subLocation || "",
          bottleSize: item.bottleSize || "",
          quantity: item.quantity
        });
        
        importCount++;
      } catch (err) {
        console.error("Error processing row:", err);
        errorCount++;
      }
    });
    
    // Show result toast
    if (importCount > 0) {
      toast({
        title: "Import successful",
        description: `Successfully imported ${importCount} medicines${errorCount > 0 ? ` (${errorCount} failed)` : ''}.`
      });
      onClose();
    } else {
      setError("Failed to import any medicines. Please check your file and mapping.");
    }
  };

  // Render content based on current step
  const renderContent = () => {
    switch (step) {
      case 'upload':
        return (
          <>
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
                We'll help you match columns to the required medicine information.
              </p>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </DialogFooter>
          </>
        );
        
      case 'mapping':
        return (
          <>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Selected file: <span className="text-muted-foreground">{fileName}</span></p>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Which column contains medicine name? <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    value={columnMapping.name || ''} 
                    onValueChange={(value) => handleColumnMappingChange('name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {renderColumnOptions()}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium flex justify-between">
                    <span>Which column contains potency?</span>
                    {!columnMapping.potency && (
                      <span className="text-xs text-muted-foreground">
                        If not selected, will try to extract from name (e.g., "Arnica 30C")
                      </span>
                    )}
                  </label>
                  <Select 
                    value={columnMapping.potency || ''} 
                    onValueChange={(value) => handleColumnMappingChange('potency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not available in file</SelectItem>
                      {renderColumnOptions()}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Which column contains company?
                  </label>
                  <Select 
                    value={columnMapping.company || ''} 
                    onValueChange={(value) => handleColumnMappingChange('company', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not available in file</SelectItem>
                      {renderColumnOptions()}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Which column contains location/area?
                  </label>
                  <Select 
                    value={columnMapping.location || ''} 
                    onValueChange={(value) => handleColumnMappingChange('location', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not available in file</SelectItem>
                      {renderColumnOptions()}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Which column contains sub-location?
                  </label>
                  <Select 
                    value={columnMapping.subLocation || ''} 
                    onValueChange={(value) => handleColumnMappingChange('subLocation', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not available in file</SelectItem>
                      {renderColumnOptions()}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Which column contains bottle size?
                  </label>
                  <Select 
                    value={columnMapping.bottleSize || ''} 
                    onValueChange={(value) => handleColumnMappingChange('bottleSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not available in file</SelectItem>
                      {renderColumnOptions()}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Which column contains quantity? 
                  </label>
                  <Select 
                    value={columnMapping.quantity || ''} 
                    onValueChange={(value) => handleColumnMappingChange('quantity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not available in file (will use default quantity of 1)</SelectItem>
                      {renderColumnOptions()}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-6 gap-2">
              <Button variant="outline" onClick={() => setStep('upload')}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button 
                onClick={generatePreview}
                disabled={!columnMapping.name}
              >
                Preview Import
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </DialogFooter>
          </>
        );
        
      case 'preview':
        const validCount = previewItems.filter(item => item.valid).length;
        const invalidCount = previewItems.length - validCount;
        
        return (
          <>
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <Check className="h-3 w-3 mr-1" /> {validCount} valid
                </Badge>
                
                {invalidCount > 0 && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    <X className="h-3 w-3 mr-1" /> {invalidCount} invalid
                  </Badge>
                )}
                
                <span className="text-xs text-muted-foreground ml-auto">
                  {previewItems.length < jsonData.length 
                    ? `Showing preview of first ${previewItems.length} rows (of ${jsonData.length} total)` 
                    : `Showing all ${previewItems.length} rows`}
                </span>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Name</TableHead>
                      <TableHead>Potency</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No data to preview
                        </TableCell>
                      </TableRow>
                    ) : (
                      previewItems.slice(0, 10).map((item, index) => (
                        <TableRow key={index} className={!item.valid ? "bg-red-50/50 dark:bg-red-900/10" : ""}>
                          <TableCell className="font-medium">{item.name || '-'}</TableCell>
                          <TableCell>{item.potency || '-'}</TableCell>
                          <TableCell>{item.company || '-'}</TableCell>
                          <TableCell>{item.location || '-'}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell>
                            {item.valid ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                <Check className="h-3 w-3 mr-1" /> Valid
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" title={item.error}>
                                <X className="h-3 w-3 mr-1" /> Error
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {previewItems.length > 10 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-2">
                          ... and {previewItems.length - 10} more rows
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {validCount === 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No valid records found</AlertTitle>
                  <AlertDescription>
                    Please go back and verify your column mapping.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter className="mt-6 gap-2">
              <Button variant="outline" onClick={() => setStep('mapping')}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Mapping
              </Button>
              <Button 
                onClick={importMedicines}
                disabled={validCount === 0}
              >
                Import {validCount} Medicines
              </Button>
            </DialogFooter>
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${step === 'preview' ? 'sm:max-w-[700px]' : 'sm:max-w-[450px]'}`}>
        <DialogHeader>
          <DialogTitle>
            {step === 'upload' && "Import Your Medicine Inventory"}
            {step === 'mapping' && "Map Your Excel Columns"}
            {step === 'preview' && "Preview Import Data"}
          </DialogTitle>
          <DialogDescription>
            {step === 'upload' && "Upload your Excel (.xlsx/.xls) or CSV (.csv) file with medicine details."}
            {step === 'mapping' && "Select which columns contain which medicine information."}
            {step === 'preview' && "Review your data before finalizing the import."}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}