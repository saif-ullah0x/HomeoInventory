import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POTENCIES, DEFAULT_COMPANIES, DEFAULT_LOCATIONS, DEFAULT_MEDICINES, BOTTLE_SIZES } from "@/lib/data";
import { useStore, Medicine } from "@/lib/store";
import DuplicateMedicineDialog from "@/components/duplicate-medicine-dialog";

const formSchema = z.object({
  name: z.string().min(2, "Medicine name must be at least 2 characters."),
  potency: z.string().min(1, "Potency is required."),
  company: z.string().min(1, "Company is required."),
  customCompany: z.string().optional(),
  location: z.string().min(1, "Location is required."),
  customLocation: z.string().optional(),
  subLocation: z.string().optional(),
  bottleSize: z.string().optional(),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or greater."),
});

type FormValues = z.infer<typeof formSchema>;

interface MedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicineId: number | null;
}

export default function MedicineModal({ isOpen, onClose, medicineId }: MedicineModalProps) {
  const { toast } = useToast();
  const [showCustomCompany, setShowCustomCompany] = useState(false);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [showCustomBottleSize, setShowCustomBottleSize] = useState(false);
  const [medicineNameSuggestions, setMedicineNameSuggestions] = useState<string[]>([]);
  const [subLocationSuggestions, setSubLocationSuggestions] = useState<string[]>([]);
  
  const addMedicine = useStore((state) => state.addMedicine);
  const updateMedicine = useStore((state) => state.updateMedicine);
  const getMedicineById = useStore((state) => state.getMedicineById);
  const medicines = useStore((state) => state.medicines);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      potency: "30C",
      company: "Masood",
      customCompany: "",
      location: "Home",
      customLocation: "",
      subLocation: "",
      bottleSize: "",
      quantity: 1,
    },
  });

  // Gather unique existing sub-locations for autocomplete
  useEffect(() => {
    // Get all non-empty sub-locations from existing medicines
    const existingSubLocations = medicines
      .map(m => m.subLocation)
      .filter((subLocation): subLocation is string => 
        subLocation !== undefined && subLocation !== null && subLocation !== "");
    
    // Save unique values for autocomplete
    const uniqueSubLocations = Array.from(new Set(existingSubLocations));
    
    // Update state for autocomplete suggestions
    setSubLocationSuggestions(uniqueSubLocations);
  }, [medicines]);
  
  useEffect(() => {
    if (medicineId !== null) {
      const medicine = getMedicineById(medicineId);
      if (medicine) {
        // Check if company is in default list
        if (!DEFAULT_COMPANIES.includes(medicine.company)) {
          form.setValue("company", "other");
          form.setValue("customCompany", medicine.company);
          setShowCustomCompany(true);
        } else {
          form.setValue("company", medicine.company);
          setShowCustomCompany(false);
        }

        // Check if location is in default list
        if (!DEFAULT_LOCATIONS.includes(medicine.location)) {
          form.setValue("location", "other");
          form.setValue("customLocation", medicine.location);
          setShowCustomLocation(true);
        } else {
          form.setValue("location", medicine.location);
          setShowCustomLocation(false);
        }
        
        // Check if bottle size is in default list
        if (medicine.bottleSize && !BOTTLE_SIZES.includes(medicine.bottleSize)) {
          form.setValue("bottleSize", medicine.bottleSize);
          setShowCustomBottleSize(true);
        } else {
          form.setValue("bottleSize", medicine.bottleSize || "");
          setShowCustomBottleSize(false);
        }

        form.setValue("name", medicine.name);
        form.setValue("potency", medicine.potency);
        form.setValue("subLocation", medicine.subLocation || "");
        form.setValue("quantity", medicine.quantity);
      }
    } else {
      form.reset({
        name: "",
        potency: "30C",
        company: "Masood",
        customCompany: "",
        location: "Home",
        customLocation: "",
        subLocation: "",
        bottleSize: "",
        quantity: 1,
      });
      setShowCustomCompany(false);
      setShowCustomLocation(false);
      setShowCustomBottleSize(false);
    }
  }, [medicineId, getMedicineById, form]);

  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateMedicine, setDuplicateMedicine] = useState<Medicine | null>(null);
  const [pendingMedicineData, setPendingMedicineData] = useState<any>(null);

  const onSubmit = async (data: FormValues) => {
    try {
      const medicineData = {
        name: data.name,
        potency: data.potency,
        company: data.company === "other" ? data.customCompany! : data.company,
        location: data.location === "other" ? data.customLocation! : data.location,
        subLocation: data.subLocation || "",
        bottleSize: data.bottleSize || "",
        quantity: data.quantity,
      };

      if (medicineId !== null) {
        updateMedicine(medicineId, medicineData);
        toast({
          title: "Medicine updated",
          description: "The medicine has been updated successfully.",
        });
        onClose();
      } else {
        // Check for duplicates before adding
        const result = await addMedicine(medicineData);
        
        if (result.success) {
          toast({
            title: "Medicine added",
            description: "The medicine has been added to your inventory.",
          });
          onClose();
        } else if (result.duplicate) {
          // Show duplicate dialog
          setDuplicateMedicine(result.duplicate);
          setPendingMedicineData(medicineData);
          setShowDuplicateDialog(true);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save medicine. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDuplicateAction = async (action: 'merge' | 'keep-both' | 'skip') => {
    if (!pendingMedicineData || !duplicateMedicine) return;
    
    try {
      switch (action) {
        case 'merge':
          // Merge quantities
          updateMedicine(duplicateMedicine.id, {
            ...duplicateMedicine,
            quantity: duplicateMedicine.quantity + pendingMedicineData.quantity
          });
          toast({
            title: "Quantities merged",
            description: `Added ${pendingMedicineData.quantity} to existing medicine. New total: ${duplicateMedicine.quantity + pendingMedicineData.quantity}.`,
          });
          break;
          
        case 'keep-both':
          // Force add as new
          const forceResult = await addMedicine(pendingMedicineData);
          if (forceResult.success) {
            toast({
              title: "Duplicate medicine added",
              description: "A duplicate medicine has been added to your inventory.",
            });
          }
          break;
          
        case 'skip':
          // Do nothing
          toast({
            title: "Addition canceled",
            description: "No changes were made to your inventory.",
          });
          break;
      }
      
      // Close both dialogs
      setShowDuplicateDialog(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the duplicate medicine.",
        variant: "destructive",
      });
    }
  };

  const handleNameInput = (value: string) => {
    if (value.length >= 2) {
      const suggestions = DEFAULT_MEDICINES.filter(medicine => 
        medicine.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setMedicineNameSuggestions(suggestions);
    } else {
      setMedicineNameSuggestions([]);
    }
  };

  const handleCompanyChange = (value: string) => {
    form.setValue("company", value);
    setShowCustomCompany(value === "other");
  };

  const handleLocationChange = (value: string) => {
    form.setValue("location", value);
    setShowCustomLocation(value === "other");
  };
  
  const handleBottleSizeChange = (value: string) => {
    form.setValue("bottleSize", value === "custom" ? "" : (value === "none" ? "" : value));
    setShowCustomBottleSize(value === "custom");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white/90 to-white/60 dark:from-gray-900/90 dark:to-gray-900/60 backdrop-blur-md border border-purple-100/30 dark:border-purple-900/30 glass-effect">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
              {medicineId !== null ? "Edit Medicine" : "Add New Medicine"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              {medicineId !== null 
                ? "Update the details of your medicine." 
                : "Add a new medicine to your inventory."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-6">
              {/* Medicine Name with Autocomplete */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Medicine Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Start typing..."
                          list="medicine-suggestions"
                          onChange={(e) => {
                            field.onChange(e);
                            handleNameInput(e.target.value);
                          }}
                          className="border-purple-100 dark:border-purple-900/50 focus:border-purple-400 focus:ring-purple-400/20 shadow-sm"
                        />
                        <datalist id="medicine-suggestions">
                          {medicineNameSuggestions.map((suggestion, index) => (
                            <option key={index} value={suggestion} />
                          ))}
                        </datalist>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Potency */}
              <FormField
                control={form.control}
                name="potency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select potency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {POTENCIES.map((potency) => (
                          <SelectItem key={potency} value={potency}>
                            {potency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select onValueChange={handleCompanyChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEFAULT_COMPANIES.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other (specify)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom Company */}
              {showCustomCompany && (
                <FormField
                  control={form.control}
                  name="customCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Company</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter company name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Storage Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Location</FormLabel>
                    <Select onValueChange={handleLocationChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEFAULT_LOCATIONS.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other (specify)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom Location */}
              {showCustomLocation && (
                <FormField
                  control={form.control}
                  name="customLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Sub-location with Autocomplete */}
              <FormField
                control={form.control}
                name="subLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-location (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          placeholder="e.g., Medicine Cabinet, Drawer" 
                          list="sublocation-suggestions"
                        />
                        <datalist id="sublocation-suggestions">
                          {subLocationSuggestions.map((suggestion, index) => (
                            <option key={index} value={suggestion} />
                          ))}
                        </datalist>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bottle Size */}
              <FormField
                control={form.control}
                name="bottleSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bottle Size (Optional)</FormLabel>
                    <Select onValueChange={handleBottleSizeChange} defaultValue={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bottle size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {BOTTLE_SIZES.filter(size => size !== "custom").map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom Size</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Custom Bottle Size */}
              {showCustomBottleSize && (
                <FormField
                  control={form.control}
                  name="bottleSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Bottle Size</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 25ml, 100ml" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === "" ? "0" : e.target.value;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="submit"
                  className="premium-gradient-button bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white px-6 py-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                >
                  {medicineId !== null ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Duplicate Medicine Dialog */}
      {duplicateMedicine && pendingMedicineData && (
        <DuplicateMedicineDialog
          isOpen={showDuplicateDialog}
          onClose={() => setShowDuplicateDialog(false)}
          existingMedicine={duplicateMedicine}
          newMedicine={pendingMedicineData}
          onAction={handleDuplicateAction}
        />
      )}
    </>
  );
}