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
import { Edit, Trash2 } from "lucide-react";
import { type Medicine } from "@/lib/store";

interface InventoryListProps {
  medicines: Medicine[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function InventoryList({ medicines, onEdit, onDelete }: InventoryListProps) {
  const getStatusBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity <= 1) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>;
    }
  };

  return (
    <div className="bg-card shadow-sm overflow-hidden rounded-lg mb-6">
      <Table>
        <TableHeader>
          <TableRow>
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
            <TableRow key={medicine.id}>
              <TableCell>
                <div className="font-medium">{medicine.name}</div>
                <div className="text-sm text-muted-foreground">{medicine.potency}</div>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(medicine.id)}
                  className="text-secondary h-8 w-8 p-0 mr-1"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(medicine.id)}
                  className="text-destructive h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
