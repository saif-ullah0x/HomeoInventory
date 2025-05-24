import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ExportModal from "@/components/export-modal";
import ImportModal from "@/components/import-modal";
import ShareModal from "@/components/share-modal";
import AIHomeopathyChatbot from "@/components/ai-homeopathy-chatbot";
import RemedyLearningAssistant from "@/components/remedy-learning-assistant";

export default function RightSideMenu() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAIChatbot, setShowAIChatbot] = useState(false);
  const [showLearningAssistant, setShowLearningAssistant] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">AI Learning Features</h3>
              
              <Button 
                variant="outline" 
                className="justify-start w-full mb-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 hover:from-purple-100 hover:to-indigo-100" 
                onClick={() => {
                  setShowAIChatbot(true);
                  setIsOpen(false);
                }}
              >
                <span className="mr-2">🤖</span> AI Homeopathy Chatbot
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start w-full bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 hover:from-purple-100 hover:to-indigo-100" 
                onClick={() => {
                  setShowLearningAssistant(true);
                  setIsOpen(false);
                }}
              >
                <span className="mr-2">🧠</span> Remedy Learning Quiz
              </Button>
            </div>

            <div className="border-t pt-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Data Management</h3>
              
              <Button 
                variant="outline" 
                className="justify-start w-full mb-2" 
                onClick={() => {
                  setShowImportModal(true);
                  setIsOpen(false);
                }}
              >
                <span className="mr-2">📥</span> Import Data
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start w-full mb-2" 
                onClick={() => {
                  setShowExportModal(true);
                  setIsOpen(false);
                }}
              >
                <span className="mr-2">📤</span> Export Data
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start w-full" 
                onClick={() => {
                  setShowShareModal(true);
                  setIsOpen(false);
                }}
              >
                <span className="mr-2">👨‍👩‍👧‍👦</span> Family Access Sharing
              </Button>
            </div>
            
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
      <AIHomeopathyChatbot isOpen={showAIChatbot} onClose={() => setShowAIChatbot(false)} />
      <RemedyLearningAssistant isOpen={showLearningAssistant} onClose={() => setShowLearningAssistant(false)} />
    </>
  );
}