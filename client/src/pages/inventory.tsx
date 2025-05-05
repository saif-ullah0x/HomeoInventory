import { useState } from "react";
import Tabs from "@/components/tabs";
import InventoryControls from "@/components/inventory-controls";
import InventoryList from "@/components/inventory-list";
import EmptyState from "@/components/empty-state";
import MedicineModal from "@/components/medicine-modal";
import ExportModal from "@/components/export-modal";
import DeleteModal from "@/components/delete-modal";
import { useStore } from "@/lib/store";

export default function Inventory() {
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [isEditMedicineModalOpen, setIsEditMedicineModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState<number | null>(null);
  const [medicineToDelete, setMedicineToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all_locations");
  const [companyFilter, setCompanyFilter] = useState("all_companies");
  
  const medicines = useStore((state) => state.medicines);
  
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

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Tabs />
      
      <InventoryControls 
        onAddClick={() => setIsAddMedicineModalOpen(true)}
        onExportClick={() => setIsExportModalOpen(true)}
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

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />

      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMedicineToDelete(null);
        }}
        medicineId={medicineToDelete}
      />
    </main>
  );
}
