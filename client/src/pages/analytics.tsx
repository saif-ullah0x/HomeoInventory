import Tabs from "@/components/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { FileDown, Download, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const medicines = useStore((state) => state.medicines);

  // Count medicines by company
  const companyData = medicines.reduce<{ name: string; value: number }[]>((acc, medicine) => {
    const existingCompany = acc.find((item) => item.name === medicine.company);
    if (existingCompany) {
      existingCompany.value += 1;
    } else {
      acc.push({ name: medicine.company, value: 1 });
    }
    return acc;
  }, []);

  // Count medicines by location
  const locationData = medicines.reduce<{ name: string; value: number }[]>((acc, medicine) => {
    const existingLocation = acc.find((item) => item.name === medicine.location);
    if (existingLocation) {
      existingLocation.value += 1;
    } else {
      acc.push({ name: medicine.location, value: 1 });
    }
    return acc;
  }, []);

  // Count medicines by status
  const statusData = medicines.reduce<{ name: string; value: number }[]>((acc, medicine) => {
    let status = "Out of Stock";
    if (medicine.quantity > 0) {
      status = medicine.quantity <= 1 ? "Low Stock" : "In Stock";
    }
    
    const existingStatus = acc.find((item) => item.name === status);
    if (existingStatus) {
      existingStatus.value += 1;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, []);

  // COLORS for charts (colorblind-friendly)
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Tabs />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Company</CardTitle>
            <CardDescription>Distribution of medicines by company</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {companyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={companyData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {companyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory by Location</CardTitle>
            <CardDescription>Distribution of medicines by storage location</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {locationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>Current stock status of medicines</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => {
                    let color = "hsl(var(--success))";
                    if (entry.name === "Low Stock") color = "hsl(var(--warning))";
                    if (entry.name === "Out of Stock") color = "hsl(var(--danger))";
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Inventory Summary</CardTitle>
          <CardDescription>Overview of your homeopathic medicine inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium text-muted-foreground">Total Medicines</h3>
              <p className="text-3xl font-bold">{medicines.length}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium text-muted-foreground">Companies</h3>
              <p className="text-3xl font-bold">{new Set(medicines.map(m => m.company)).size}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium text-muted-foreground">Locations</h3>
              <p className="text-3xl font-bold">{new Set(medicines.map(m => m.location)).size}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
