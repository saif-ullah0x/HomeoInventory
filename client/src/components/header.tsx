import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Pill, PillBottle, Download, Sun, Moon } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";

export default function Header() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const exportData = useStore((state) => state.exportData);

  const handleExport = async () => {
    try {
      const blob = new Blob([JSON.stringify(exportData(), null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `homeo-inventory-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Your inventory data has been exported."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <PillBottle className="text-primary text-2xl mr-2 h-6 w-6" />
            <Link href="/">
              <h1 className="text-xl font-semibold cursor-pointer">HomeoInvent</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleExport}
              className="text-muted-foreground hover:text-primary"
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-primary"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 mr-1" />
              ) : (
                <Moon className="h-4 w-4 mr-1" />
              )}
              <span className="hidden sm:inline">Theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
