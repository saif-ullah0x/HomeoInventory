import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Book, Target, ArrowLeft } from "lucide-react";

interface AILearningAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AILearningAssistantSimple({ isOpen, onClose }: AILearningAssistantProps) {
  const [activeTab, setActiveTab] = useState("learn");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-4 shadow-lg">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 justify-center">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm shadow-lg">
                <Brain className="h-6 w-6 text-white drop-shadow-sm" />
              </div>
              <div className="text-center">
                <DialogTitle className="text-white text-xl font-bold tracking-wide">
                  AI-Enhanced Remedy Learning Assistant
                </DialogTitle>
                <p className="text-purple-100 text-sm">
                  Discover homeopathic remedies for common conditions
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-lg"
            >
              ✕ Close
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-900/50 p-4">
          <Tabs defaultValue="learn" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="learn" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Learn Remedies
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Test Knowledge
              </TabsTrigger>
            </TabsList>

            <div className="pb-4">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                🔍 Search for remedies, conditions, or browse common symptoms:
              </Label>
              <div className="flex gap-3">
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g., Arnica, headache, fever..."
                  className="flex-1"
                />
                <Button>
                  {activeTab === "learn" ? "Search" : "Start Quiz"}
                </Button>
              </div>
            </div>

            <div className="min-h-[400px]">
              <TabsContent value="learn" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Homeopathic Learning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Enter a remedy name, symptom, or condition in the search box above 
                      to learn more about homeopathic treatments.
                    </p>
                    <p className="mt-4">
                      This feature helps you understand the principles of homeopathic medicine 
                      and how different remedies are used for various conditions.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Your Knowledge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Search for a topic above to generate a personalized quiz based on your learning.
                    </p>
                    <p className="mt-4">
                      Quizzes help reinforce your understanding of homeopathic remedies and their applications.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="bg-gray-50 dark:bg-gray-800 p-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Inventory
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}