import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Brain, Book, Target, ArrowLeft, Search, Star, CheckCircle, X, Sparkles } from "lucide-react";

interface LearningAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HomeopathicRemedy {
  id: number;
  name: string;
  commonName: string;
  uses: string[];
  symptoms: string[];
  dosage: string;
  frequency: string;
  category: string;
  potency: string;
  keynotes: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const HOMEOPATHIC_REMEDIES: HomeopathicRemedy[] = [
  {
    id: 1,
    name: "Arnica Montana",
    commonName: "Mountain Arnica",
    uses: ["Bruises", "Trauma", "Muscle soreness", "Post-surgical healing", "Shock"],
    symptoms: ["Physical trauma", "Bruising", "Muscle aches", "Soreness from overexertion"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Trauma & Injury",
    potency: "30C",
    keynotes: ["First remedy for any injury", "Refuses help saying they're fine", "Bed feels too hard"],
    difficulty: 'Beginner'
  },
  {
    id: 2,
    name: "Belladonna",
    commonName: "Deadly Nightshade",
    uses: ["High fever", "Headaches", "Sore throat", "Inflammation", "Sudden onset conditions"],
    symptoms: ["Sudden high fever", "Red face", "Throbbing headache", "Hot and burning sensations"],
    dosage: "3-5 pellets",
    frequency: "Every 2-3 hours",
    category: "Fever & Inflammation",
    potency: "30C",
    keynotes: ["Sudden violent onset", "Red, hot, throbbing", "Worse from light and noise"],
    difficulty: 'Beginner'
  }
];

export default function LearningAssistantFixed({ isOpen, onClose }: LearningAssistantProps) {
  const [activeTab, setActiveTab] = useState("learn");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRemedies, setFilteredRemedies] = useState<HomeopathicRemedy[]>(HOMEOPATHIC_REMEDIES);
  const [selectedRemedy, setSelectedRemedy] = useState<HomeopathicRemedy | null>(null);

  // Hide body scroll when learning interface is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = HOMEOPATHIC_REMEDIES.filter(remedy =>
        remedy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remedy.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remedy.uses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase())) ||
        remedy.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        remedy.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRemedies(filtered);
    } else {
      setFilteredRemedies(HOMEOPATHIC_REMEDIES);
    }
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0"
      style={{ 
        zIndex: 2147483647,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'auto',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 25%, #6D28D9 50%, #5B21B6 75%, #4C1D95 100%)'
      }}
    >
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="relative p-6 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-violet-500/30 to-purple-600/30 backdrop-blur-md"></div>
          <div className="absolute inset-0 bg-white/5"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg border border-white/30">
                <Brain className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold tracking-wide drop-shadow-lg">
                  AI-Enhanced Remedy Learning Assistant
                </h1>
                <p className="text-white/90 text-sm flex items-center gap-2 mt-1">
                  <Sparkles className="h-4 w-4" />
                  Master homeopathic remedies with interactive learning and quizzes
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 px-4 py-2"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-purple-50/90 to-violet-100/85 backdrop-blur-sm"></div>
          
          <ScrollArea className="flex-1 overflow-y-auto relative z-10 h-full">
            <div className="p-6 min-h-full">
              <Tabs defaultValue="learn" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6 bg-white/80 backdrop-blur-md shadow-xl border border-white/40 rounded-2xl p-1">
                  <TabsTrigger value="learn" className="flex items-center gap-2 font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-200">
                    <Book className="h-4 w-4" />
                    Learn Remedies
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="flex items-center gap-2 font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-200">
                    <Target className="h-4 w-4" />
                    Test Knowledge
                  </TabsTrigger>
                </TabsList>

                <div className="mb-6">
                  <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                    🔍 Search remedies, conditions, or symptoms:
                  </Label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="e.g., Arnica, headache, fever, bruises..."
                        className="pl-10 bg-white/70 backdrop-blur-sm border-purple-200 focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>

                <TabsContent value="learn" className="mt-0">
                  {selectedRemedy ? (
                    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-purple-200">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-2xl text-purple-800">
                              {selectedRemedy.name}
                            </CardTitle>
                            <p className="text-purple-600 italic">
                              {selectedRemedy.commonName}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={selectedRemedy.difficulty === 'Beginner' ? 'default' : selectedRemedy.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                              {selectedRemedy.difficulty}
                            </Badge>
                            <Badge variant="outline">{selectedRemedy.category}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <Button
                          onClick={() => setSelectedRemedy(null)}
                          variant="outline"
                          size="sm"
                          className="mb-4"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to List
                        </Button>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <Star className="h-5 w-5 text-yellow-500" />
                              Primary Uses
                            </h4>
                            <ul className="space-y-2">
                              {selectedRemedy.uses.map((use, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {use}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-lg mb-3">Key Symptoms</h4>
                            <ul className="space-y-2">
                              {selectedRemedy.symptoms.map((symptom, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  {symptom}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredRemedies.map((remedy) => (
                        <Card 
                          key={remedy.id} 
                          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white/90 backdrop-blur-sm border-purple-200 hover:border-purple-400"
                          onClick={() => setSelectedRemedy(remedy)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg text-purple-800">
                                  {remedy.name}
                                </CardTitle>
                                <p className="text-sm text-purple-600 italic">
                                  {remedy.commonName}
                                </p>
                              </div>
                              <Badge variant={remedy.difficulty === 'Beginner' ? 'default' : remedy.difficulty === 'Intermediate' ? 'secondary' : 'destructive'} className="text-xs">
                                {remedy.difficulty}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Badge variant="outline" className="mb-3">
                              {remedy.category}
                            </Badge>
                            <p className="text-sm text-gray-600 mb-3">
                              Primary use: {remedy.uses[0]}
                            </p>
                            <div className="text-xs text-gray-500">
                              Click to learn more →
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="quiz" className="mt-0">
                  <Card className="text-center bg-white/90 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl text-purple-800">Quiz Feature Coming Soon!</CardTitle>
                      <p className="text-gray-600">
                        Interactive quizzes will be available here to test your knowledge.
                      </p>
                    </CardHeader>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}