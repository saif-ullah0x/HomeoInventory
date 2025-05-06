import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, UserCircle } from "lucide-react";
import ExportModal from "@/components/export-modal";
import ImportModal from "@/components/import-modal";
import ShareModal from "@/components/share-modal";
import LoginModal from "@/components/login-modal";
import { useAuth } from "@/lib/firebase";

export default function RightSideMenu() {
  // All useState calls must come before other hooks
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Keep useAuth after all useState hooks
  const { user, isEnabled } = useAuth();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="justify-start" 
              onClick={() => {
                setShowImportModal(true);
                setIsOpen(false);
              }}
            >
              <span className="mr-2">📥</span> Import Data
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start" 
              onClick={() => {
                setShowExportModal(true);
                setIsOpen(false);
              }}
            >
              <span className="mr-2">📤</span> Export Data
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start" 
              onClick={() => {
                setShowShareModal(true);
                setIsOpen(false);
              }}
            >
              <span className="mr-2">📱</span> Share Inventory
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => {
                setShowLoginModal(true);
                setIsOpen(false);
              }}
            >
              {user ? (
                <>
                  <UserCircle className="h-4 w-4 mr-2 text-primary" />
                  {user.displayName || user.email || "Manage Account"}
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2 text-primary" />
                  {isEnabled ? "Login / Sync" : "Cloud Sync (Coming Soon)"}
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start mt-4"
              onClick={() => {
                window.open('https://www.buymeacoffee.com', '_blank');
              }}
            >
              <span className="mr-2">❤️</span> Donate to Support Our Work
            </Button>
            
            <div className="mt-auto pt-6">
              <p className="text-xs text-muted-foreground">
                Application version: 1.0.0
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}