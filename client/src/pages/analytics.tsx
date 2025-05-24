import Tabs from "@/components/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { FileDown, Download, File, TrendingUp, Calendar, Star, Activity } from "lucide-react";
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
  const { toast } = useToast();

  // Count medicines by company - group minor companies into Others category
  const companyData = medicines.reduce<{ name: string; value: number }[]>((acc, medicine) => {
    const existingCompany = acc.find((item) => item.name === medicine.company);
    if (existingCompany) {
      existingCompany.value += 1;
    } else {
      acc.push({ name: medicine.company, value: 1 });
    }
    return acc;
  }, []);
  
  // Define major companies that should remain separate
  const MAJOR_COMPANIES = ["Masood", "Kamal", "BM", "Kent", "WS"];
  
  // Group data - keep major companies separate, group others
  const groupedCompanyData = companyData.reduce<{ name: string; value: number }[]>((acc, company) => {
    // Check if this is a major company we want to show individually
    if (MAJOR_COMPANIES.includes(company.name)) {
      acc.push(company);
    } else {
      // For minor companies, add to "Others" category
      const others = acc.find(item => item.name === "Others");
      if (others) {
        others.value += company.value;
      } else {
        acc.push({ name: "Others", value: company.value });
      }
    }
    return acc;
  }, []);
  
  // Sort by value (descending)
  const sortedCompanyData = [...groupedCompanyData].sort((a, b) => b.value - a.value);

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

  // Count medicines by status - only show as "Out of Stock" when quantity = 0, otherwise "In Stock"
  const statusData = medicines.reduce<{ name: string; value: number }[]>((acc, medicine) => {
    const status = medicine.quantity === 0 ? "Out of Stock" : "In Stock";
    
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
  
  // Function to export analytics report to PDF
  const exportAnalyticsToPDF = () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text("Homeopathic Medicine Inventory - Analytics Report", 14, 22);
      
      // Add export date
      doc.setFontSize(10);
      doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add summary information
      doc.setFontSize(14);
      doc.text("Inventory Summary", 14, 40);
      
      doc.setFontSize(10);
      doc.text(`Total Medicines: ${medicines.length}`, 14, 50);
      doc.text(`Companies: ${new Set(medicines.map(m => m.company)).size}`, 14, 55);
      doc.text(`Locations: ${new Set(medicines.map(m => m.location)).size}`, 14, 60);
      
      // Add company distribution table
      doc.setFontSize(14);
      doc.text("Distribution by Company", 14, 70);
      
      autoTable(doc, {
        startY: 75,
        head: [['Company', 'Count', 'Percentage']],
        body: sortedCompanyData.map(item => [
          item.name,
          item.value,
          `${((item.value / medicines.length) * 100).toFixed(1)}%`
        ]),
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [66, 139, 202] }
      });
      
      // Add location distribution table on a new page
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Distribution by Location", 14, 20);
      
      autoTable(doc, {
        startY: 25,
        head: [['Location', 'Count', 'Percentage']],
        body: locationData.map(item => [
          item.name,
          item.value,
          `${((item.value / medicines.length) * 100).toFixed(1)}%`
        ]),
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [66, 139, 202] }
      });
      
      // Add status distribution table
      // Use fixed value for simplicity
      const statusTableY = 120;
      doc.setFontSize(14);
      doc.text("Inventory Status Distribution", 14, statusTableY);
      
      autoTable(doc, {
        startY: statusTableY + 5,
        head: [['Status', 'Count', 'Percentage']],
        body: statusData.map(item => [
          item.name,
          item.value,
          `${((item.value / medicines.length) * 100).toFixed(1)}%`
        ]),
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [66, 139, 202] }
      });
      
      // Save the PDF
      doc.save("homeo-inventory-analytics.pdf");
      
      toast({
        title: "Export successful",
        description: "Your analytics report has been exported as PDF."
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your analytics report.",
        variant: "destructive"
      });
    }
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Tabs />
      </div>
      
      {/* Usage Trends Section */}
      <Card className="mb-6 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
            <TrendingUp className="h-5 w-5" />
            Usage Trends & Insights
          </CardTitle>
          <CardDescription className="text-purple-600 dark:text-purple-400">
            Discover patterns in your homeopathic medicine usage and get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Most Used Category</p>
                <p className="text-lg font-bold text-purple-600">
                  {medicines.length > 0 ? 
                    Object.entries(medicines.reduce((acc, med) => {
                      const category = med.company || 'Unknown';
                      acc[category] = (acc[category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Top Location</p>
                <p className="text-lg font-bold text-green-600">
                  {medicines.length > 0 ? 
                    Object.entries(medicines.reduce((acc, med) => {
                      acc[med.location] = (acc[med.location] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Recent Additions</p>
                <p className="text-lg font-bold text-blue-600">
                  {medicines.filter(m => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(m.createdAt) > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Inventory Health</p>
                <p className="text-lg font-bold text-orange-600">
                  {medicines.length > 10 ? 'Excellent' : medicines.length > 5 ? 'Good' : 'Growing'}
                </p>
              </div>
            </div>
          </div>
          
          {medicines.length > 0 && (
            <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Smart Recommendations</h4>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>• Consider organizing your {Object.keys(medicines.reduce((acc, med) => {
                  acc[med.location] = true;
                  return acc;
                }, {} as Record<string, boolean>)).length} locations for better accessibility</p>
                <p>• Your inventory includes {new Set(medicines.map(m => m.potency)).size} different potencies - great variety!</p>
                <p>• You have {medicines.length} remedies from {new Set(medicines.map(m => m.company)).size} companies</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Company</CardTitle>
            <CardDescription>Distribution of medicines by company</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {sortedCompanyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sortedCompanyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sortedCompanyData.map((entry, index) => {
                      // Special color for "Others" category
                      if (entry.name === "Others") {
                        return <Cell key={`cell-${index}`} fill="#B0B0B0" />;
                      }
                      return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
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
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
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
                  labelLine={false}
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
