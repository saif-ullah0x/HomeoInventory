import { useState } from "react";
import Tabs from "@/components/tabs";
import InventoryControls from "@/components/inventory-controls";
import InventoryList from "@/components/inventory-list";
import EmptyState from "@/components/empty-state";
import MedicineModal from "@/components/medicine-modal";
import DeleteModal from "@/components/delete-modal";
import ImportModal from "@/components/import-modal";
import ShareModal from "@/components/share-modal";
import AIDoctorModal from "@/components/ai-doctor-modal";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Inventory() {
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [isEditMedicineModalOpen, setIsEditMedicineModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAIDoctorModalOpen, setIsAIDoctorModalOpen] = useState(false);
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
        onShareClick={() => setIsShareModalOpen(true)}
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
      
      <AIDoctorModal 
        isOpen={isAIDoctorModalOpen}
        onClose={() => setIsAIDoctorModalOpen(false)}
      />
      
      {/* Fixed floating buttons positioned at bottom right */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-10">
        {/* AI Doctor Button */}
        <button 
          onClick={() => setIsAIDoctorModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 ease-in-out flex items-center justify-center w-16 h-16"
          aria-label="AI Homeopathic Doctor"
        >
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-stethoscope">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
            <span className="text-xs font-medium mt-1">AI Doctor</span>
          </div>
        </button>
        
        {/* Share Button */}
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-lg transition-all duration-200 ease-in-out flex items-center justify-center"
          aria-label="Family Access Sharing"
        >
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="text-xs font-medium mt-1">Local Sharing</span>
          </div>
        </button>
      </div>
    </main>
  );
}
