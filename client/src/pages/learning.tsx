import React, { useState } from "react";
import { Book, Brain, BookOpen, Search, Lightbulb, Award, CheckCircle, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

/**
 * AI-Enhanced Remedy Learning Assistant
 * 
 * This component provides a sophisticated learning interface for homeopathic remedies
 * with comprehensive lessons and interactive quizzes in a visually appealing format.
 * 
 * UI/UX Features:
 * - Premium header with bold "AI-Enhanced Remedy Learning Assistant" text and purple gradient
 * - Enhanced glassy buttons with purple gradients, glowing shadows, and subtle animations
 * - Card-based layout for better organization and visual hierarchy
 * - Improved tab navigation with elegant indicators and smooth transitions
 * - Polished and professional design throughout the interface
 */

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
  description: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  remedyId: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const dummyRemedies: HomeopathicRemedy[] = [
  {
    id: 1,
    name: "Arnica Montana",
    commonName: "Mountain Daisy",
    uses: ["Bruises", "Trauma", "Muscle soreness", "Post-surgical healing", "Sports injuries"],
    symptoms: ["Bruised, sore feeling", "Fear of being touched", "Saying 'I am fine' when clearly injured", "Restlessness"],
    dosage: "3-5 pellets",
    frequency: "Every 4-6 hours as needed",
    category: "Trauma and Injury",
    potency: "30C, 200C, 1M",
    keynotes: [
      "The first remedy to consider for injuries and trauma",
      "Patient may deny being hurt even when seriously injured",
      "Better from lying down with head low",
      "Fears being approached or touched"
    ],
    difficulty: "Beginner",
    description: "Arnica Montana, commonly known as Mountain Daisy, is one of the most frequently used homeopathic remedies for trauma, injury, and bruising. It works wonderfully for sore, bruised feelings, both physically and emotionally. Arnica is a crucial first-aid remedy that helps reduce swelling, prevents bruising, and speeds healing after accidents, injuries, surgery, or dental work."
  },
  {
    id: 2,
    name: "Belladonna",
    commonName: "Deadly Nightshade",
    uses: ["High fever", "Throbbing headaches", "Ear infections", "Sore throat", "Sunstroke"],
    symptoms: ["Sudden onset of intense symptoms", "Hot, red, dry skin", "Dilated pupils", "Pulsating sensations", "Hypersensitivity to light, noise, and touch"],
    dosage: "3-5 pellets",
    frequency: "Every 1-2 hours for acute conditions, reducing as symptoms improve",
    category: "Fever and Inflammation",
    potency: "6C, 30C, 200C",
    keynotes: [
      "Symptoms appear suddenly and intensely",
      "Burning, pulsating, throbbing pains",
      "Face is flushed, hot, and red",
      "Better from sitting semi-upright and in quiet, dark room"
    ],
    difficulty: "Beginner",
    description: "Belladonna, derived from Deadly Nightshade, is a powerful remedy for conditions that appear suddenly, with intensity and heat. It's characterized by redness, heat, burning, throbbing sensations, and hypersensitivity. Belladonna is particularly useful for high fevers with hot, flushed face, dilated pupils, and burning skin that radiates heat."
  },
  {
    id: 3,
    name: "Nux Vomica",
    commonName: "Poison Nut",
    uses: ["Digestive issues", "Hangover", "Constipation", "Overindulgence", "Irritability"],
    symptoms: ["Irritability", "Hypersensitivity", "Chilliness", "Digestive upsets", "Constipation with ineffectual urging"],
    dosage: "3-5 pellets",
    frequency: "Once or twice daily, as needed",
    category: "Digestive and Nervous System",
    potency: "6C, 30C, 200C",
    keynotes: [
      "Great for effects of overindulgence (food, alcohol, coffee, drugs)",
      "Irritable, impatient, and easily offended",
      "Chilly and worse from cold",
      "Constipation with frequent, ineffectual urging"
    ],
    difficulty: "Beginner",
    description: "Nux Vomica is an excellent remedy for the effects of modern, high-stress living. It helps with digestive issues arising from overindulgence in food, alcohol, coffee, or drugs. The typical Nux Vomica patient is irritable, competitive, ambitious, and easily angered or offended. This remedy is often used for hangovers, constipation, and digestive complaints."
  },
  {
    id: 4,
    name: "Pulsatilla",
    commonName: "Windflower",
    uses: ["Changeable symptoms", "Ear infections", "Hormonal imbalances", "Colds with yellow-green discharge", "Digestive upset from rich food"],
    symptoms: ["Weepiness", "Desire for sympathy", "Changeable symptoms", "Absence of thirst", "Yellow-green, bland discharges"],
    dosage: "3-5 pellets",
    frequency: "3 times daily or as needed",
    category: "Emotional and Hormonal",
    potency: "6C, 30C, 200C",
    keynotes: [
      "Gentle, mild, yielding disposition",
      "Weepy and emotional, craves comfort and sympathy",
      "Symptoms constantly change and shift",
      "Better in open air and worse in warm rooms"
    ],
    difficulty: "Beginner",
    description: "Pulsatilla is known as the 'weathervane remedy' because its symptoms are changeable like the wind. It's especially useful for gentle, mild people who are emotional, weepy, and seek attention and sympathy. Pulsatilla patients typically feel better in open air and worse in warm, stuffy rooms. This remedy is excellent for children's complaints and women's hormonal issues."
  },
  {
    id: 5,
    name: "Rhus Toxicodendron",
    commonName: "Poison Ivy",
    uses: ["Joint pain", "Sprains and strains", "Restlessness", "Skin eruptions", "Back pain"],
    symptoms: ["Stiffness relieved by continued motion", "Restlessness", "Worse on first movement", "Better from continued movement", "Worse in cold, damp weather"],
    dosage: "3-5 pellets",
    frequency: "3-4 times daily as needed",
    category: "Musculoskeletal and Skin",
    potency: "6C, 30C, 200C",
    keynotes: [
      "Stiffness and pain that improves with continued movement",
      "Worse when first starting to move, better with continued motion",
      "Restlessness, can't get comfortable in bed",
      "Symptoms worsen in cold, damp weather"
    ],
    difficulty: "Intermediate",
    description: "Rhus Toxicodendron, derived from poison ivy, is one of the main remedies for musculoskeletal complaints. The key characteristic is stiffness and pain that improves with movement. The person may be extremely restless, constantly changing position to find relief. This remedy is especially useful for sprains, strains, joint pain, and certain skin conditions with intense itching."
  }
];

const dummyQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which homeopathic remedy is considered the first choice for bruises and trauma?",
    options: ["Nux Vomica", "Arnica Montana", "Belladonna", "Pulsatilla"],
    correctAnswer: 1,
    explanation: "Arnica Montana is typically the first remedy to consider for injuries, trauma, bruising, and soreness. It helps reduce swelling, prevents bruising, and speeds healing after injuries or surgery.",
    remedyId: 1,
    difficulty: "Beginner"
  },
  {
    id: 2,
    question: "What is the characteristic fever pattern that would indicate Belladonna?",
    options: [
      "Low-grade fever with chills and exhaustion",
      "Sudden high fever with hot, red skin and dilated pupils",
      "Fever that comes on gradually with profuse sweating",
      "Recurring fever every afternoon with dry cough"
    ],
    correctAnswer: 1,
    explanation: "Belladonna is indicated for conditions with sudden onset, intense symptoms, burning heat, and redness. The typical Belladonna fever comes on suddenly with very hot, red skin, dilated pupils, and throbbing sensations.",
    remedyId: 2,
    difficulty: "Beginner"
  },
  {
    id: 3,
    question: "Which remedy is often used for digestive issues related to overindulgence in food or alcohol?",
    options: ["Pulsatilla", "Rhus Toxicodendron", "Nux Vomica", "Arnica Montana"],
    correctAnswer: 2,
    explanation: "Nux Vomica is excellent for digestive complaints resulting from overindulgence in food, alcohol, coffee, or drugs. It's often used for hangovers, constipation, and indigestion from excessive eating.",
    remedyId: 3,
    difficulty: "Beginner"
  },
  {
    id: 4,
    question: "A patient has joint pain that is worse when first starting to move but improves with continued motion. They're also restless at night. Which remedy might help?",
    options: ["Pulsatilla", "Rhus Toxicodendron", "Arnica Montana", "Belladonna"],
    correctAnswer: 1,
    explanation: "Rhus Toxicodendron is indicated when stiffness and pain improve with continued movement. The keynote is 'worse on first motion, better from continued motion.' Patients are often restless and can't get comfortable in bed.",
    remedyId: 5,
    difficulty: "Intermediate"
  },
  {
    id: 5,
    question: "Which remedy is often described as the 'weathervane remedy' due to its changeable symptoms?",
    options: ["Pulsatilla", "Belladonna", "Nux Vomica", "Rhus Toxicodendron"],
    correctAnswer: 0,
    explanation: "Pulsatilla is known as the 'weathervane remedy' because its symptoms are changeable like the wind. The patient's mood, pain, and other symptoms frequently shift and change location.",
    remedyId: 4,
    difficulty: "Beginner"
  }
];

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState("learn");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [activeRemedyId, setActiveRemedyId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  // Filter remedies based on search and difficulty
  const filteredRemedies = dummyRemedies.filter((remedy) => {
    const matchesSearch = 
      remedy.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      remedy.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remedy.uses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase())) ||
      remedy.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      remedy.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === "all" || remedy.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  // Filter quiz questions based on difficulty
  const filteredQuizQuestions = dummyQuizQuestions.filter((question) => {
    return selectedDifficulty === "all" || question.difficulty === selectedDifficulty;
  });

  const currentQuestion = filteredQuizQuestions[currentQuizIndex];
  
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuizIndex(0);
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      setIsAnswerSubmitted(true);
      if (selectedAnswer === currentQuestion.correctAnswer) {
        setCorrectAnswers((prev) => prev + 1);
        toast({
          title: "Correct!",
          description: currentQuestion.explanation,
          variant: "default",
        });
      } else {
        toast({
          title: "Incorrect",
          description: currentQuestion.explanation,
          variant: "destructive",
        });
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < filteredQuizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950 text-gray-800 dark:text-gray-100">
      {/* Dark overlay for added depth and focus */}
      <div className="absolute inset-0 bg-black/5 dark:bg-black/30 backdrop-blur-[2px] pointer-events-none z-0"></div>
      
      {/* Close button in top-right corner */}
      <Button 
        variant="outline"
        size="icon"
        onClick={() => setLocation("/")}
        className="absolute top-5 right-5 z-50 rounded-full w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md 
                  border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 
                  shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Enhanced Header with Purple Gradient */}
      <div className="relative z-10 py-8 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-full mb-3 shadow-xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-md">
              AI-Enhanced Remedy Learning Assistant
            </h1>
            <p className="text-purple-100 max-w-2xl">
              Explore and master homeopathic remedies through interactive lessons and knowledge tests
            </p>
          </div>
        </div>
        {/* Decorative gradient bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-300/50 via-white/70 to-indigo-300/50"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="learn" value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Tab List with Premium Glassy Buttons - Simplified to match the design */}
          <div className="max-w-[700px] mx-auto mb-10">
            <TabsList className="flex rounded-full overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-purple-100/50 dark:border-purple-800/50 shadow-xl p-0 h-[70px]">
              {/* Learn Remedies Button */}
              <TabsTrigger 
                value="learn" 
                className="flex-1 relative group overflow-hidden rounded-l-full py-4 h-full
                          data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600
                          data-[state=active]:text-white data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400
                          data-[state=active]:shadow-lg
                          transition-all duration-300 ease-out"
              >
                <div className="relative flex items-center justify-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/20 shadow-sm">
                    <Book className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-medium">Learn Remedies</span>
                </div>
              </TabsTrigger>
              
              {/* Test Knowledge Button */}
              <TabsTrigger 
                value="quiz" 
                className="flex-1 relative group overflow-hidden rounded-r-full py-4 h-full
                          data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600
                          data-[state=active]:text-white data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400
                          data-[state=active]:shadow-lg
                          transition-all duration-300 ease-out"
              >
                <div className="relative flex items-center justify-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/20 shadow-sm">
                    <Brain className="h-5 w-5" />
                  </div>
                  <span className="text-lg font-medium">Test Knowledge</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Learn Content */}
          <TabsContent value="learn" className="outline-none">
            <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl border border-purple-100/50 dark:border-purple-800/50 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 pointer-events-none"></div>
              <CardContent className="p-6 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      🔍 Search Remedies
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                      <Input
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, condition, or symptoms..."
                        className="pl-10 bg-white/90 dark:bg-gray-700/90 backdrop-blur-md border-purple-200 focus:border-purple-400 
                                  shadow-lg rounded-xl transition-all duration-300 focus:shadow-xl focus:scale-[1.01]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      🎯 Difficulty Level
                    </Label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-md border-purple-200 focus:border-purple-400 
                                                shadow-lg rounded-xl transition-all duration-300 focus:shadow-xl focus:scale-[1.01]">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-purple-200 dark:border-purple-800">
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remedy Cards with Premium Hover Effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRemedies.length > 0 ? (
                filteredRemedies.map((remedy) => (
                  <Card 
                    key={remedy.id} 
                    className={`transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer 
                               backdrop-blur-lg border border-purple-100/50 dark:border-purple-800/50 relative overflow-hidden
                               ${activeRemedyId === remedy.id 
                                 ? 'bg-gradient-to-br from-purple-50/90 to-indigo-50/90 dark:from-purple-900/80 dark:to-indigo-900/80 shadow-[0_10px_30px_-5px_rgba(139,92,246,0.3)]'
                                 : 'bg-white/80 dark:bg-gray-800/80 shadow-xl'}`}
                    onClick={() => setActiveRemedyId(activeRemedyId === remedy.id ? null : remedy.id)}
                  >
                    {/* Premium gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 pointer-events-none"></div>
                    
                    {/* Glowing border effect on active state */}
                    {activeRemedyId === remedy.id && (
                      <div className="absolute inset-0 border-2 border-purple-400/30 dark:border-purple-400/20 rounded-lg"></div>
                    )}
                    
                    <CardContent className="p-6 relative">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">{remedy.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">{remedy.commonName}</p>
                        </div>
                        <Badge className={`${
                          remedy.difficulty === 'Beginner' 
                            ? 'bg-green-100/80 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50' 
                            : remedy.difficulty === 'Intermediate'
                            ? 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50'
                            : 'bg-red-100/80 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50'
                        } shadow-sm backdrop-blur-sm`}>
                          {remedy.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{remedy.category}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Common Uses</h4>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {remedy.uses.slice(0, 3).map((use, index) => (
                              <Badge key={index} variant="outline" className="bg-purple-50/80 dark:bg-purple-900/30 text-xs border-purple-200/80 dark:border-purple-800/50 shadow-sm backdrop-blur-sm">
                                {use}
                              </Badge>
                            ))}
                            {remedy.uses.length > 3 && (
                              <Badge variant="outline" className="bg-purple-50/80 dark:bg-purple-900/30 text-xs border-purple-200/80 dark:border-purple-800/50 shadow-sm backdrop-blur-sm">
                                +{remedy.uses.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {activeRemedyId === remedy.id && (
                          <div className="mt-4 space-y-4 animate-fadeIn">
                            <Separator className="my-4 bg-gradient-to-r from-purple-200/30 via-purple-400/30 to-purple-200/30 dark:from-purple-800/30 dark:via-purple-600/30 dark:to-purple-800/30" />
                            
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{remedy.description}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Key Symptoms</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {remedy.symptoms.map((symptom, index) => (
                                  <li key={index}>{symptom}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Keynotes</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {remedy.keynotes.map((keynote, index) => (
                                  <li key={index}>{keynote}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Potency</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{remedy.potency}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dosage</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{remedy.dosage}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <Search className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No remedies found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Quiz Content */}
          <TabsContent value="quiz" className="outline-none">
            <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl border border-purple-100/50 dark:border-purple-800/50 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 pointer-events-none"></div>
              <CardContent className="p-6 relative">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">Test Your Knowledge</h2>
                  <p className="text-gray-600 dark:text-gray-400">Challenge yourself with questions about homeopathic remedies.</p>
                </div>
                
                <div>
                  <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    🎯 Difficulty Level
                  </Label>
                  <Select value={selectedDifficulty} onValueChange={(value) => {
                    setSelectedDifficulty(value);
                    resetQuiz();
                  }}>
                    <SelectTrigger className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-md border-purple-200 focus:border-purple-400 
                                              shadow-lg rounded-xl transition-all duration-300 focus:shadow-xl focus:scale-[1.01]">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-purple-200 dark:border-purple-800">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {!quizStarted ? (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl border border-purple-100/50 dark:border-purple-800/50 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 pointer-events-none"></div>
                <CardContent className="p-8 text-center relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400 mb-3">Ready to Start?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    This quiz contains {filteredQuizQuestions.length} questions to test your knowledge of homeopathic remedies.
                  </p>
                  {filteredQuizQuestions.length > 0 ? (
                    <Button 
                      onClick={handleStartQuiz}
                      className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                                text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all
                                border border-white/10 hover:border-white/20"
                    >
                      {/* Button glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 hover:opacity-100 
                                     transition-opacity duration-1000 animate-pulse-slow"></div>
                      <span className="mr-2">Start Quiz</span>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  ) : (
                    <p className="text-amber-600 dark:text-amber-400 font-medium">
                      No questions available for the selected difficulty. Please select a different level.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : quizCompleted ? (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl border border-purple-100/50 dark:border-purple-800/50 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 pointer-events-none"></div>
                <CardContent className="p-8 text-center relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <Award className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400 mb-3">Quiz Completed!</h3>
                  <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
                    Your Score: <span className="font-bold">{correctAnswers}</span> out of <span className="font-bold">{filteredQuizQuestions.length}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {correctAnswers === filteredQuizQuestions.length 
                      ? "Perfect score! You're a homeopathy expert!" 
                      : correctAnswers >= filteredQuizQuestions.length * 0.7 
                      ? "Great job! You have a solid understanding of homeopathic remedies."
                      : "Keep learning! Review the remedies and try again."}
                  </p>
                  <div className="mb-6 px-8">
                    <div className="h-3 bg-purple-100/50 dark:bg-purple-900/30 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                        style={{ width: `${(correctAnswers / filteredQuizQuestions.length) * 100}%`, transition: 'width 1s ease-in-out' }}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={resetQuiz}
                    className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                              text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all
                              border border-white/10 hover:border-white/20"
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 hover:opacity-100 
                                   transition-opacity duration-1000 animate-pulse-slow"></div>
                    Restart Quiz
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl border border-purple-100/50 dark:border-purple-800/50 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 pointer-events-none"></div>
                <CardContent className="p-8 relative">
                  <div className="flex justify-between items-center mb-6">
                    <Badge variant="outline" className="bg-purple-50/80 dark:bg-purple-900/30 px-4 py-1.5 border-purple-200/80 dark:border-purple-800/50 shadow-md backdrop-blur-sm text-purple-700 dark:text-purple-300 rounded-full">
                      Question {currentQuizIndex + 1} of {filteredQuizQuestions.length}
                    </Badge>
                    <Badge variant="outline" className={`px-4 py-1.5 rounded-full shadow-md backdrop-blur-sm ${
                      currentQuestion.difficulty === 'Beginner' 
                        ? 'bg-green-50/80 text-green-700 border-green-200/80 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50' 
                        : currentQuestion.difficulty === 'Intermediate'
                        ? 'bg-yellow-50/80 text-yellow-700 border-yellow-200/80 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/50'
                        : 'bg-red-50/80 text-red-700 border-red-200/80 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50'
                    }`}>
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">{currentQuestion.question}</h3>
                  
                  <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option, index) => (
                      <div 
                        key={index}
                        onClick={() => !isAnswerSubmitted && setSelectedAnswer(index)}
                        className={`p-4 rounded-xl cursor-pointer transition-all
                                   ${selectedAnswer === index 
                                     ? 'bg-purple-100/80 dark:bg-purple-900/50 border-2 border-purple-400/70 dark:border-purple-500/70 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                     : 'bg-white/90 dark:bg-gray-700/90 border-2 border-transparent hover:border-purple-200/70 dark:hover:border-purple-800/70 hover:shadow-md'}
                                   ${isAnswerSubmitted && index === currentQuestion.correctAnswer
                                     ? 'bg-green-100/80 dark:bg-green-900/50 border-2 border-green-400/70 dark:border-green-500/70 shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                                     : isAnswerSubmitted && selectedAnswer === index
                                     ? 'bg-red-100/80 dark:bg-red-900/50 border-2 border-red-400/70 dark:border-red-500/70 shadow-[0_0_15px_rgba(248,113,113,0.2)]'
                                     : ''}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-all
                                         ${selectedAnswer === index 
                                           ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md' 
                                           : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}
                                         ${isAnswerSubmitted && index === currentQuestion.correctAnswer
                                           ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md'
                                           : isAnswerSubmitted && selectedAnswer === index
                                           ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md'
                                           : ''}`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{option}</span>
                          {isAnswerSubmitted && index === currentQuestion.correctAnswer && (
                            <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                          )}
                          {isAnswerSubmitted && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer && (
                            <X className="ml-auto h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={resetQuiz}
                      className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4"
                    >
                      Exit Quiz
                    </Button>
                    
                    {!isAnswerSubmitted ? (
                      <Button 
                        onClick={handleSubmitAnswer}
                        disabled={selectedAnswer === null}
                        className={`relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                                  text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all px-6
                                  border border-white/10 hover:border-white/20
                                  ${selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {/* Button glow effect */}
                        {selectedAnswer !== null && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 hover:opacity-100 
                                        transition-opacity duration-1000 animate-pulse-slow"></div>
                        )}
                        Submit Answer
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleNextQuestion}
                        className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                                  text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all px-6
                                  border border-white/10 hover:border-white/20"
                      >
                        {/* Button glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 hover:opacity-100 
                                      transition-opacity duration-1000 animate-pulse-slow"></div>
                        {currentQuizIndex < filteredQuizQuestions.length - 1 ? "Next Question" : "See Results"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}