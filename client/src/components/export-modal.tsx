import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileJson, FileSpreadsheet, File, FileText } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Medicine } from "@/lib/store";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { toast } = useToast();
  const exportData = useStore((state) => state.exportData);

  const handleExportJSON = () => {
    try {
      const data = exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
      });
      downloadFile(blob, "homeo-inventory.json");
      
      toast({
        title: "Export successful",
        description: "Your inventory data has been exported as JSON."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = () => {
    try {
      const data = exportData();
      
      // Create CSV header row
      const headers = [
        "Name", "Potency", "Company", "Location", 
        "SubLocation", "Bottle Size", "Quantity"
      ];
      
      // Convert each medicine to CSV row
      const rows = data.medicines.map(medicine => [
        `"${medicine.name}"`,
        `"${medicine.potency}"`,
        `"${medicine.company}"`,
        `"${medicine.location}"`,
        `"${medicine.subLocation || ''}"`,
        `"${medicine.bottleSize || ''}"`,
        medicine.quantity
      ]);
      
      // Combine header and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, "homeo-inventory.csv");
      
      toast({
        title: "Export successful",
        description: "Your inventory data has been exported as CSV."
      });
      onClose();
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = () => {
    try {
      const data = exportData();
      
      // Convert medicines to rows for Excel
      const worksheet = XLSX.utils.json_to_sheet(
        data.medicines.map(medicine => ({
          "Medicine Name": medicine.name,
          "Potency": medicine.potency,
          "Company": medicine.company,
          "Location": medicine.location,
          "Sub Location": medicine.subLocation || "",
          "Bottle Size": medicine.bottleSize || "",
          "Quantity": medicine.quantity
        }))
      );
      
      // Create a workbook with our worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
      
      // Convert to binary and create blob
      const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
      
      // Convert binary string to ArrayBuffer
      const buffer = new ArrayBuffer(excelData.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < excelData.length; i++) {
        view[i] = excelData.charCodeAt(i) & 0xFF;
      }
      
      // Create blob and download
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      downloadFile(blob, "homeo-inventory.xlsx");
      
      toast({
        title: "Export successful",
        description: "Your inventory data has been exported as Excel."
      });
      onClose();
    } catch (error) {
      console.error("Excel export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data to Excel.",
        variant: "destructive"
      });
    }
  };

  const handleExportPDF = () => {
    try {
      const data = exportData();
      
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text("Homeopathic Medicine Inventory", 14, 22);
      
      // Add export date
      doc.setFontSize(10);
      doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Prepare data for the table
      const tableRows = data.medicines.map(medicine => [
        medicine.name,
        medicine.potency,
        medicine.company,
        medicine.location,
        medicine.subLocation || "",
        medicine.bottleSize || "",
        medicine.quantity.toString()
      ]);
      
      // Create the table
      autoTable(doc, {
        startY: 35,
        head: [['Medicine Name', 'Potency', 'Company', 'Location', 'Sub-Location', 'Bottle Size', 'Quantity']],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [66, 139, 202] }
      });
      
      // Save the PDF
      doc.save("homeo-inventory.pdf");
      
      toast({
        title: "Export successful",
        description: "Your inventory data has been exported as PDF."
      });
      onClose();
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data to PDF.",
        variant: "destructive"
      });
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Medicine Inventory</DialogTitle>
          <DialogDescription>
            Choose a format to export your complete medicine inventory list.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="mb-2">
            <h3 className="text-sm font-medium mb-2">Recommended Export Formats:</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="default"
                className="w-full flex justify-between items-center h-16 bg-primary-100 hover:bg-primary/90"
                onClick={handleExportPDF}
              >
                <span className="font-medium">PDF File</span>
                <File className="h-5 w-5 text-red-600" />
              </Button>
              <Button
                variant="default"
                className="w-full flex justify-between items-center h-16 bg-primary-100 hover:bg-primary/90"
                onClick={handleExportExcel}
              >
                <span className="font-medium">Excel File</span>
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
              </Button>
            </div>
          </div>
          
          <div className="pt-3 border-t">
            <h3 className="text-xs text-muted-foreground mb-2">Other Formats:</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full flex justify-between items-center h-12"
                onClick={handleExportCSV}
              >
                <span className="font-medium">CSV File</span>
                <FileText className="h-4 w-4 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                className="w-full flex justify-between items-center h-12"
                onClick={handleExportJSON}
              >
                <span className="font-medium">JSON File</span>
                <FileJson className="h-4 w-4 text-amber-600" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
