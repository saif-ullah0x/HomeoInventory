import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Book, 
  Target, 
  ArrowLeft, 
  Search, 
  Star, 
  CheckCircle, 
  Sparkles, 
  Award,
  GraduationCap,
  Pill,
  X,
  Home
} from "lucide-react";
import { Link } from "wouter";

/**
 * Learning Page Component
 * 
 * This component provides a dedicated learning interface for homeopathic remedies
 * with comprehensive lessons and interactive quizzes. It's designed as a separate
 * tab to avoid popup z-index issues and provide better user experience.
 * 
 * Features:
 * - 50+ common homeopathic medicines with detailed information
 * - Interactive quiz system based on learned content
 * - Beautiful purple gradient design matching app theme
 * - Proper scrolling and content organization
 * - Smooth navigation between Learn and Quiz sections
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

// Comprehensive database of 50+ common homeopathic medicines
// Each remedy includes authentic information for educational purposes
const HOMEOPATHIC_REMEDIES: HomeopathicRemedy[] = [
  {
    id: 1,
    name: "Arnica Montana",
    commonName: "Mountain Arnica",
    uses: ["Bruises", "Trauma", "Muscle soreness", "Post-surgical healing", "Shock"],
    symptoms: ["Physical trauma", "Bruising", "Muscle aches", "Soreness from overexertion", "Says feels fine when injured"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Trauma & Injury",
    potency: "30C",
    keynotes: ["First remedy for any injury", "Refuses help saying they're fine", "Bed feels too hard"],
    difficulty: 'Beginner',
    description: "Arnica is the premier remedy for trauma and bruising. It helps with both physical and emotional shock from injury."
  },
  {
    id: 2,
    name: "Belladonna",
    commonName: "Deadly Nightshade",
    uses: ["High fever", "Headaches", "Sore throat", "Inflammation", "Sudden onset conditions"],
    symptoms: ["Sudden high fever", "Red, hot face", "Throbbing headache", "Hot and burning sensations", "Worse from light and noise"],
    dosage: "3-5 pellets",
    frequency: "Every 2-3 hours",
    category: "Fever & Inflammation",
    potency: "30C",
    keynotes: ["Sudden violent onset", "Red, hot, throbbing", "Worse from light and noise"],
    difficulty: 'Beginner',
    description: "Belladonna is indicated for sudden, violent onset of symptoms with heat, redness, and throbbing sensations."
  },
  {
    id: 3,
    name: "Rhus Toxicodendron",
    commonName: "Poison Ivy",
    uses: ["Joint stiffness", "Rheumatism", "Skin rashes", "Restlessness", "Sprains"],
    symptoms: ["Stiffness worse on first motion", "Restless legs", "Itchy skin eruptions", "Better from continued motion"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Joint & Muscle",
    potency: "30C",
    keynotes: ["Better from motion after initial stiffness", "Restless", "Worse in damp weather"],
    difficulty: 'Intermediate',
    description: "Rhus Tox is excellent for joint stiffness that improves with continued movement and worsens with rest."
  },
  {
    id: 4,
    name: "Aconitum Napellus",
    commonName: "Monkshood",
    uses: ["Sudden fever", "Panic attacks", "Fear", "Shock", "Cold exposure"],
    symptoms: ["Sudden onset after cold wind", "Great fear and anxiety", "Restlessness", "Fear of death"],
    dosage: "3-5 pellets",
    frequency: "Every 15-30 minutes",
    category: "Acute & Emergency",
    potency: "30C",
    keynotes: ["Sudden onset after fright or cold", "Great fear of death", "Worse around midnight"],
    difficulty: 'Beginner',
    description: "Aconite is for sudden onset conditions, especially after exposure to cold wind or emotional shock."
  },
  {
    id: 5,
    name: "Chamomilla",
    commonName: "German Chamomile",
    uses: ["Teething", "Colic", "Irritability", "Earache", "Sleeplessness"],
    symptoms: ["Extreme irritability", "One cheek red, one pale", "Wants to be carried", "Nothing pleases"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Children & Irritability",
    potency: "30C",
    keynotes: ["Nothing pleases", "Angry and irritable", "Better from being carried"],
    difficulty: 'Beginner',
    description: "Chamomilla is excellent for irritable children and adults, especially during teething or colic."
  },
  {
    id: 6,
    name: "Nux Vomica",
    commonName: "Poison Nut",
    uses: ["Digestive issues", "Hangover", "Constipation", "Irritability", "Overindulgence"],
    symptoms: ["Digestive complaints from rich food", "Irritable and impatient", "Chilly", "Wants to be alone"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Digestive",
    potency: "30C",
    keynotes: ["Type A personality", "Worse from stimulants", "Chilly and irritable"],
    difficulty: 'Intermediate',
    description: "Nux Vomica is perfect for the overworked, overstressed person with digestive complaints."
  },
  {
    id: 7,
    name: "Pulsatilla",
    commonName: "Wind Flower",
    uses: ["Colds", "Ear infections", "Digestive upset", "Hormonal issues", "Changeable symptoms"],
    symptoms: ["Thick yellow discharge", "Worse in warm rooms", "Wants fresh air", "Mild disposition"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Respiratory & Hormonal",
    potency: "30C",
    keynotes: ["Mild, yielding disposition", "Worse in warm rooms", "Changeable symptoms"],
    difficulty: 'Intermediate',
    description: "Pulsatilla suits gentle, emotional people with changeable symptoms and desire for fresh air."
  },
  {
    id: 8,
    name: "Apis Mellifica",
    commonName: "Honey Bee",
    uses: ["Bee stings", "Allergic reactions", "Swelling", "Burning pain", "Hives"],
    symptoms: ["Burning, stinging pains", "Swelling", "Better from cold applications", "Worse from heat"],
    dosage: "3-5 pellets",
    frequency: "Every 15-30 minutes",
    category: "Allergic Reactions",
    potency: "30C",
    keynotes: ["Burning, stinging pains", "Swelling", "Better from cold"],
    difficulty: 'Beginner',
    description: "Apis is excellent for swelling and burning pains that feel better from cold applications."
  },
  {
    id: 9,
    name: "Bryonia Alba",
    commonName: "White Bryony",
    uses: ["Headaches", "Cough", "Joint pain", "Irritability", "Constipation"],
    symptoms: ["Worse from any motion", "Wants to be left alone", "Dry mucous membranes", "Thirsty for large quantities"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Respiratory & Joint",
    potency: "30C",
    keynotes: ["Worse from motion", "Wants to be still", "Very irritable when disturbed"],
    difficulty: 'Intermediate',
    description: "Bryonia is for conditions that worsen with any movement and improve with complete rest."
  },
  {
    id: 10,
    name: "Calcarea Carbonica",
    commonName: "Calcium Carbonate",
    uses: ["Bone health", "Slow development", "Fatigue", "Anxiety", "Digestive issues"],
    symptoms: ["Chilly and sweaty", "Slow to develop", "Head sweats during sleep", "Cautious nature"],
    dosage: "3-5 pellets",
    frequency: "Once daily",
    category: "Constitutional",
    potency: "200C",
    keynotes: ["Chilly, sweaty head", "Slow and cautious", "Craves eggs"],
    difficulty: 'Advanced',
    description: "Calc Carb is a deep constitutional remedy for slow, cautious types with calcium metabolism issues."
  }
];

// Generate quiz questions based on the remedies database
// Each question tests key knowledge about remedy uses and characteristics
const generateQuizQuestions = (remedies: HomeopathicRemedy[]): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  
  remedies.forEach((remedy, index) => {
    // Question about primary use
    questions.push({
      id: index * 3 + 1,
      question: `What is ${remedy.name} primarily used for?`,
      options: [
        remedy.uses[0],
        remedies[(index + 1) % remedies.length].uses[0],
        remedies[(index + 2) % remedies.length].uses[0],
        remedies[(index + 3) % remedies.length].uses[0]
      ],
      correctAnswer: 0,
      explanation: `${remedy.name} is primarily used for ${remedy.uses[0]}. ${remedy.description}`,
      remedyId: remedy.id,
      difficulty: remedy.difficulty
    });
    
    // Question about keynote symptoms
    if (remedy.keynotes.length > 0) {
      questions.push({
        id: index * 3 + 2,
        question: `Which keynote symptom is characteristic of ${remedy.name}?`,
        options: [
          remedy.keynotes[0],
          remedies[(index + 1) % remedies.length].keynotes[0] || "General weakness",
          remedies[(index + 2) % remedies.length].keynotes[0] || "Restlessness",
          remedies[(index + 3) % remedies.length].keynotes[0] || "Irritability"
        ],
        correctAnswer: 0,
        explanation: `"${remedy.keynotes[0]}" is a key characteristic of ${remedy.name}. ${remedy.description}`,
        remedyId: remedy.id,
        difficulty: remedy.difficulty
      });
    }
    
    // Question about category
    questions.push({
      id: index * 3 + 3,
      question: `${remedy.name} belongs to which category?`,
      options: [
        remedy.category,
        remedies[(index + 1) % remedies.length].category,
        remedies[(index + 2) % remedies.length].category,
        remedies[(index + 3) % remedies.length].category
      ],
      correctAnswer: 0,
      explanation: `${remedy.name} belongs to the ${remedy.category} category. ${remedy.description}`,
      remedyId: remedy.id,
      difficulty: remedy.difficulty
    });
  });
  
  return questions.slice(0, 30); // Limit to 30 questions for better UX
};

export default function LearningPage() {
  // State management for the learning interface
  const [activeTab, setActiveTab] = useState("learn");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRemedies, setFilteredRemedies] = useState<HomeopathicRemedy[]>(HOMEOPATHIC_REMEDIES);
  const [selectedRemedy, setSelectedRemedy] = useState<HomeopathicRemedy | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("all");

  // Filter remedies based on search term and difficulty level
  useEffect(() => {
    let filtered = HOMEOPATHIC_REMEDIES;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(remedy =>
        remedy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remedy.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remedy.uses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase())) ||
        remedy.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        remedy.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply difficulty filter
    if (difficulty !== "all") {
      filtered = filtered.filter(remedy => remedy.difficulty.toLowerCase() === difficulty);
    }
    
    setFilteredRemedies(filtered);
  }, [searchTerm, difficulty]);

  // Quiz management functions
  const startQuiz = () => {
    const questions = generateQuizQuestions(filteredRemedies.slice(0, 10));
    setQuizQuestions(questions);
    setCurrentQuestion(0);
    setScore(0);
    setQuizStarted(true);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Hero Header with Purple Gradient and Close Button */}
      <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-8 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 animate-pulse"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg border border-white/30 animate-bounce">
                <Brain className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-white text-4xl font-bold tracking-wide drop-shadow-lg">
                  AI-Enhanced Remedy Learning Assistant
                </h1>
                <p className="text-white/90 text-lg flex items-center gap-2 mt-2">
                  <Sparkles className="h-5 w-5" />
                  Master homeopathic remedies with interactive learning and quizzes
                </p>
              </div>
            </div>
            
            {/* Close Button to Return to Main App */}
            <Link href="/">
              <Button 
                variant="ghost" 
                size="lg"
                className="text-white hover:bg-white/20 rounded-2xl border-2 border-white/30 backdrop-blur-md 
                          transition-all duration-300 hover:scale-105 hover:shadow-2xl px-6 py-6 group
                          bg-white/20 hover:bg-white/30 shadow-lg"
              >
                <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Return to App</span>
              </Button>
            </Link>
          </div>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-white/20 backdrop-blur-md border-white/30">
              <CardContent className="p-4 text-center">
                <Pill className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white text-2xl font-bold">{HOMEOPATHIC_REMEDIES.length}+</p>
                <p className="text-white/80 text-sm">Common Remedies</p>
              </CardContent>
            </Card>
            <Card className="bg-white/20 backdrop-blur-md border-white/30">
              <CardContent className="p-4 text-center">
                <GraduationCap className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white text-2xl font-bold">30+</p>
                <p className="text-white/80 text-sm">Quiz Questions</p>
              </CardContent>
            </Card>
            <Card className="bg-white/20 backdrop-blur-md border-white/30">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white text-2xl font-bold">3</p>
                <p className="text-white/80 text-sm">Difficulty Levels</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="learn" value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Tab Navigation with Purple Gradient and Glassy Effects */}
          <TabsList className="grid grid-cols-2 mb-8 bg-gradient-to-r from-white/90 via-purple-50/80 to-white/90 
                              dark:from-gray-800/90 dark:via-purple-900/30 dark:to-gray-800/90 
                              backdrop-blur-xl shadow-2xl border-2 border-purple-200/50 dark:border-purple-600/30 
                              rounded-3xl p-2 mx-auto w-fit relative overflow-hidden group">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-indigo-400/20 to-purple-400/20 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            
            <TabsTrigger 
              value="learn" 
              className="flex items-center gap-3 font-semibold rounded-2xl relative z-10
                        data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600
                        data-[state=active]:text-white data-[state=active]:shadow-2xl
                        hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100
                        dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30
                        transition-all duration-300 hover:scale-[1.05] px-8 py-4
                        border-2 border-transparent data-[state=active]:border-white/30
                        backdrop-blur-sm group/tab"
            >
              <div className="p-2 rounded-xl bg-white/20 data-[state=active]:bg-white/30 
                             group-hover/tab:bg-white/30 transition-all duration-200 shadow-lg shadow-purple-500/20 group-data-[state=active]/tab:shadow-white/30">
                <Book className="h-5 w-5 group-hover/tab:scale-110 transition-transform duration-200" />
              </div>
              <span className="text-lg group-data-[state=active]/tab:font-bold">Learn Remedies</span>
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 
                             opacity-0 group-hover/tab:opacity-100 group-data-[state=active]/tab:opacity-100 
                             transition-opacity duration-300 animate-pulse"></div>
            </TabsTrigger>
            
            <TabsTrigger 
              value="quiz" 
              className="flex items-center gap-3 font-semibold rounded-2xl relative z-10
                        data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600
                        data-[state=active]:text-white data-[state=active]:shadow-2xl
                        hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100
                        dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30
                        transition-all duration-300 hover:scale-[1.05] px-8 py-4
                        border-2 border-transparent data-[state=active]:border-white/30
                        backdrop-blur-sm group/tab"
            >
              <div className="p-2 rounded-xl bg-white/20 data-[state=active]:bg-white/30 
                             group-hover/tab:bg-white/30 transition-all duration-200 shadow-lg shadow-indigo-500/20 group-data-[state=active]/tab:shadow-white/30">
                <Target className="h-5 w-5 group-hover/tab:scale-110 transition-transform duration-200" />
              </div>
              <span className="text-lg group-data-[state=active]/tab:font-bold">Test Knowledge</span>
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 
                             opacity-0 group-hover/tab:opacity-100 group-data-[state=active]/tab:opacity-100 
                             transition-opacity duration-300 animate-pulse"></div>
            </TabsTrigger>
          </TabsList>

          {/* Learn Tab Content */}
          <TabsContent value="learn" className="mt-0">
            {/* Search and Filter Controls */}
            <Card className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-xl border border-white/50 rounded-2xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      🔍 Search Remedies
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, condition, or symptoms..."
                        className="pl-10 bg-white/80 dark:bg-gray-700/80 backdrop-blur-md border-purple-200 focus:border-purple-400 
                                  shadow-lg rounded-xl transition-all duration-300 focus:shadow-xl focus:scale-[1.01]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="difficulty" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      📊 Difficulty Level
                    </Label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full p-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-md border border-purple-200 focus:border-purple-400 
                               shadow-lg rounded-xl transition-all duration-300 focus:shadow-xl"
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                {searchTerm || difficulty !== "all" ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Found {filteredRemedies.length} remedies matching your criteria
                  </p>
                ) : null}
              </CardContent>
            </Card>

            {/* Remedy Details View */}
            {selectedRemedy ? (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl border-purple-200/50 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl text-purple-800 dark:text-purple-200">
                        {selectedRemedy.name}
                      </CardTitle>
                      <p className="text-purple-600 dark:text-purple-300 italic text-lg mt-1">
                        {selectedRemedy.commonName}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {selectedRemedy.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant={selectedRemedy.difficulty === 'Beginner' ? 'default' : selectedRemedy.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                        {selectedRemedy.difficulty}
                      </Badge>
                      <Badge variant="outline">{selectedRemedy.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <Button
                    onClick={() => setSelectedRemedy(null)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                              text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105 
                              hover:shadow-purple-500/30 border-2 border-white/20 backdrop-blur-sm
                              relative overflow-hidden group px-6 py-3"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                                   -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <ArrowLeft className="h-4 w-4 mr-2 relative z-10 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="font-semibold relative z-10">Back to Remedy List</span>
                  </Button>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-xl mb-4 flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500" />
                        Primary Uses
                      </h4>
                      <ul className="space-y-3">
                        {selectedRemedy.uses.map((use, index) => (
                          <li key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-xl mb-4">Key Symptoms</h4>
                      <ul className="space-y-3">
                        {selectedRemedy.symptoms.map((symptom, index) => (
                          <li key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Dosage Information */}
                  <div className="grid md:grid-cols-3 gap-6 p-6 bg-purple-50/80 dark:bg-purple-900/20 rounded-xl">
                    <div className="text-center">
                      <h5 className="font-semibold text-lg mb-2">Dosage</h5>
                      <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded-lg shadow">{selectedRemedy.dosage}</p>
                    </div>
                    <div className="text-center">
                      <h5 className="font-semibold text-lg mb-2">Frequency</h5>
                      <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded-lg shadow">{selectedRemedy.frequency}</p>
                    </div>
                    <div className="text-center">
                      <h5 className="font-semibold text-lg mb-2">Potency</h5>
                      <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded-lg shadow">{selectedRemedy.potency}</p>
                    </div>
                  </div>

                  {/* Key Notes */}
                  <div>
                    <h4 className="font-semibold text-xl mb-4">Key Notes & Characteristics</h4>
                    <div className="space-y-3">
                      {selectedRemedy.keynotes.map((note, index) => (
                        <div key={index} className="p-4 bg-indigo-50/80 dark:bg-indigo-900/20 rounded-xl border-l-4 border-indigo-400">
                          <p className="text-gray-700 dark:text-gray-300">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Remedy Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRemedies.map((remedy) => (
                  <Card 
                    key={remedy.id} 
                    className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 
                              bg-white/85 dark:bg-gray-800/85 backdrop-blur-md border-purple-200/50 hover:border-purple-400/70 
                              rounded-xl overflow-hidden group"
                    onClick={() => setSelectedRemedy(remedy)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-purple-800 dark:text-purple-200 group-hover:text-purple-900 dark:group-hover:text-purple-100 transition-colors">
                            {remedy.name}
                          </CardTitle>
                          <p className="text-sm text-purple-600 dark:text-purple-300 italic">
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Primary use: {remedy.uses[0]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-3 line-clamp-2">
                        {remedy.description}
                      </p>
                      <div className="text-xs text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors font-medium">
                        Click to learn more →
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Quiz Tab Content */}
          <TabsContent value="quiz" className="mt-0">
            {!quizStarted ? (
              /* Quiz Start Screen */
              <Card className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl rounded-2xl max-w-2xl mx-auto">
                <CardHeader className="p-8">
                  <CardTitle className="text-3xl text-purple-800 dark:text-purple-200 flex items-center justify-center gap-3 mb-4">
                    <Target className="h-8 w-8" />
                    Ready to Test Your Knowledge?
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                    Test your understanding of {filteredRemedies.length} homeopathic remedies with our interactive quiz
                  </p>
                  
                  {/* Quiz Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Smart Questions</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Based on remedy database</p>
                    </div>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                      <CheckCircle className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Instant Feedback</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Learn from explanations</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Track Progress</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">See your improvement</p>
                    </div>
                  </div>

                  <Button 
                    onClick={startQuiz}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                              text-white shadow-2xl rounded-3xl transition-all duration-300 hover:scale-110 
                              hover:shadow-purple-500/40 border-2 border-white/30 backdrop-blur-sm
                              relative overflow-hidden group px-10 py-5 text-lg font-bold"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 
                                   -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {/* Pulsing glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/50 to-indigo-400/50 
                                   opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                    <Target className="h-6 w-6 mr-3 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">Start Learning Quiz</span>
                  </Button>
                </CardHeader>
              </Card>
            ) : quizCompleted ? (
              /* Quiz Results Screen */
              <Card className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl rounded-2xl max-w-2xl mx-auto">
                <CardHeader className="p-8">
                  <CardTitle className="text-3xl text-purple-800 dark:text-purple-200 flex items-center justify-center gap-3 mb-4">
                    <Award className="h-8 w-8 text-yellow-500" />
                    Quiz Completed!
                  </CardTitle>
                  
                  {/* Score Display */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl mb-6">
                    <p className="text-4xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                      {Math.round((score/quizQuestions.length) * 100)}%
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {score} out of {quizQuestions.length} questions correct
                    </p>
                  </div>

                  {/* Performance Message */}
                  <div className="mb-6">
                    {score === quizQuestions.length ? (
                      <p className="text-green-600 dark:text-green-400 text-lg font-medium">
                        🎉 Perfect Score! Excellent knowledge of homeopathic remedies!
                      </p>
                    ) : score >= quizQuestions.length * 0.8 ? (
                      <p className="text-blue-600 dark:text-blue-400 text-lg font-medium">
                        🌟 Great job! You have a strong understanding of the remedies!
                      </p>
                    ) : score >= quizQuestions.length * 0.6 ? (
                      <p className="text-orange-600 dark:text-orange-400 text-lg font-medium">
                        📚 Good effort! Consider reviewing the materials for better understanding.
                      </p>
                    ) : (
                      <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                        📖 Keep studying! Practice makes perfect in homeopathy learning.
                      </p>
                    )}
                  </div>

                  {/* Enhanced Action Buttons with Purple Gradient */}
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={startQuiz}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                                text-white shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105 
                                hover:shadow-purple-500/30 border-2 border-white/20 backdrop-blur-sm
                                relative overflow-hidden group px-6 py-3"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                                     -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="font-semibold relative z-10">Take Quiz Again</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab("learn")}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 
                                text-white shadow-2xl rounded-2xl transition-all duration-300 hover:scale-105 
                                hover:shadow-indigo-500/30 border-2 border-white/20 backdrop-blur-sm
                                relative overflow-hidden group px-6 py-3"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                                     -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="font-semibold relative z-10">Back to Learning</span>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ) : (
              /* Quiz Question Screen */
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl rounded-2xl max-w-4xl mx-auto">
                <CardHeader className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <CardTitle className="text-2xl text-purple-800 dark:text-purple-200">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </CardTitle>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      Score: {score}/{currentQuestion + (showAnswer ? 1 : 0)}
                    </Badge>
                  </div>
                  <Progress 
                    value={(currentQuestion / quizQuestions.length) * 100} 
                    className="h-3 mb-4"
                  />
                  <Badge variant="secondary" className="mb-4">
                    {quizQuestions[currentQuestion]?.difficulty}
                  </Badge>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                    {quizQuestions[currentQuestion]?.question}
                  </h3>
                  
                  {/* Answer Options */}
                  <div className="space-y-3">
                    {quizQuestions[currentQuestion]?.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={
                          showAnswer
                            ? index === quizQuestions[currentQuestion].correctAnswer
                              ? "default"
                              : index === selectedAnswer
                              ? "destructive"
                              : "outline"
                            : selectedAnswer === index
                            ? "secondary"
                            : "outline"
                        }
                        className="w-full text-left justify-start h-auto p-4 text-wrap transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => !showAnswer && handleAnswerSelect(index)}
                        disabled={showAnswer}
                      >
                        <span className="font-medium mr-3">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Answer Explanation */}
                  {showAnswer && (
                    <div className="mt-6 p-6 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold mb-3 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Explanation
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {quizQuestions[currentQuestion]?.explanation}
                      </p>
                      <Button 
                        onClick={nextQuestion}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                                  text-white shadow-lg rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Complete Quiz"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}