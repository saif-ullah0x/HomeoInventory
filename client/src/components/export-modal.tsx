import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileJson, FileSpreadsheet } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

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
        "SubLocation", "Quantity"
      ];
      
      // Convert each medicine to CSV row
      const rows = data.medicines.map(medicine => [
        `"${medicine.name}"`,
        `"${medicine.potency}"`,
        `"${medicine.company}"`,
        `"${medicine.location}"`,
        `"${medicine.subLocation || ''}"`,
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
          <DialogTitle>Export Inventory</DialogTitle>
          <DialogDescription>
            Choose a format to export your inventory data.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          <Button
            variant="outline"
            className="w-full flex justify-between items-center h-16"
            onClick={handleExportCSV}
          >
            <span className="font-medium">CSV File</span>
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
          </Button>
          <Button
            variant="outline"
            className="w-full flex justify-between items-center h-16"
            onClick={handleExportJSON}
          >
            <span className="font-medium">JSON File</span>
            <FileJson className="h-5 w-5 text-amber-600" />
          </Button>
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
