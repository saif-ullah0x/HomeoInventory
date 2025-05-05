import { useState } from "react";
import Tabs from "@/components/tabs";
import InventoryControls from "@/components/inventory-controls";
import InventoryList from "@/components/inventory-list";
import EmptyState from "@/components/empty-state";
import MedicineModal from "@/components/medicine-modal";
import DeleteModal from "@/components/delete-modal";
import ImportModal from "@/components/import-modal";
import ShareModal from "@/components/share-modal";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Inventory() {
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [isEditMedicineModalOpen, setIsEditMedicineModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState<number | null>(null);
  const [medicineToDelete, setMedicineToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all_locations");
  const [companyFilter, setCompanyFilter] = useState("all_companies");
  
  const { toast } = useToast();
  const medicines = useStore((state) => state.medicines);
  const exportData = useStore((state) => state.exportData);
  
  // Filtered medicines based on search and filters
  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "all_locations" || medicine.location === locationFilter;
    const matchesCompany = companyFilter === "all_companies" || medicine.company === companyFilter;
    return matchesSearch && matchesLocation && matchesCompany;
  });

  // Handle medicine edit
  const handleEditMedicine = (id: number) => {
    setMedicineToEdit(id);
    setIsEditMedicineModalOpen(true);
  };

  // Handle medicine delete
  const handleDeleteMedicine = (id: number) => {
    setMedicineToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  // Export to PDF function
  const exportToPDF = () => {
    try {
      const data = exportData();
      const sortedMedicines = [...data.medicines].sort((a, b) => a.name.localeCompare(b.name));
      
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text("Homeopathic Medicine Inventory", 14, 22);
      
      // Add export date
      doc.setFontSize(10);
      doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Prepare data for the table
      const tableRows = sortedMedicines.map(medicine => [
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
        description: "Your inventory has been exported as PDF."
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data to PDF.",
        variant: "destructive"
      });
    }
  };
  
  // Export to Excel function
  const exportToExcel = () => {
    try {
      const data = exportData();
      const sortedMedicines = [...data.medicines].sort((a, b) => a.name.localeCompare(b.name));
      
      // Convert medicines to rows for Excel
      const worksheet = XLSX.utils.json_to_sheet(
        sortedMedicines.map(medicine => ({
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "homeo-inventory.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Your inventory has been exported as Excel."
      });
    } catch (error) {
      console.error("Excel export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data to Excel.",
        variant: "destructive"
      });
    }
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Tabs />
      
      <InventoryControls 
        onAddClick={() => setIsAddMedicineModalOpen(true)}
        onImportClick={() => setIsImportModalOpen(true)}
        onExportToPDF={exportToPDF}
        onExportToExcel={exportToExcel}
        onSearchChange={setSearchTerm}
        onLocationFilterChange={setLocationFilter}
        onCompanyFilterChange={setCompanyFilter}
        searchTerm={searchTerm}
        locationFilter={locationFilter}
        companyFilter={companyFilter}
      />
      
      {filteredMedicines.length > 0 ? (
        <InventoryList 
          medicines={filteredMedicines} 
          onEdit={handleEditMedicine} 
          onDelete={handleDeleteMedicine} 
        />
      ) : (
        <EmptyState 
          onAddClick={() => setIsAddMedicineModalOpen(true)} 
          isSearching={searchTerm !== "" || locationFilter !== "all_locations" || companyFilter !== "all_companies"}
          searchTerm={searchTerm}
        />
      )}

      <MedicineModal 
        isOpen={isAddMedicineModalOpen} 
        onClose={() => setIsAddMedicineModalOpen(false)}
        medicineId={null}
      />

      <MedicineModal 
        isOpen={isEditMedicineModalOpen} 
        onClose={() => {
          setIsEditMedicineModalOpen(false);
          setMedicineToEdit(null);
        }}
        medicineId={medicineToEdit}
      />

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMedicineToDelete(null);
        }}
        medicineId={medicineToDelete}
      />
      
      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
      
      {/* Family Share Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="lg" 
          onClick={() => setIsShareModalOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg button-hover-effect glow-effect"
        >
          <Users className="h-6 w-6" />
        </Button>
      </div>
    </main>
  );
}
