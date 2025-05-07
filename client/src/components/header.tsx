import * as React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { AppLogo } from "@/components/app-logo";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Simply toggle the theme - no animation needed
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center slide-up-fade-in">
            <div className="mr-2">
              <AppLogo />
            </div>
            <Link href="/">
              <h1 className="font-display text-2xl font-bold cursor-pointer gradient-text">
                HomeoInvent
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleTheme}
              className="button-hover-effect border-2 dark:border-slate-600 hover:border-primary dark:hover:border-primary transition-all duration-200 flex items-center space-x-1 relative overflow-hidden group"
              style={{ 
                boxShadow: `0 0 8px rgba(${theme === 'dark' ? '252, 232, 131, 0.3' : '124, 58, 237, 0.3'})`
              }}
            >
              <div className="absolute inset-0 opacity-0 dark:opacity-10 bg-primary group-hover:opacity-20 transition-opacity duration-200 rounded-sm"></div>
              {theme === "dark" ? (
                <Sun className="h-5 w-5 mr-1 text-yellow-500 drop-shadow-md" />
              ) : (
                <Moon className="h-5 w-5 mr-1 text-indigo-600 drop-shadow-md" />
              )}
              <span className="hidden sm:inline font-medium">Theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
