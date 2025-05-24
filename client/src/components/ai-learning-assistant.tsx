import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Brain, 
  Search, 
  CheckCircle, 
  XCircle, 
  Award,
  Lightbulb,
  Clock,
  Target,
  Thermometer,
  Zap,
  Heart,
  Activity,
  Stethoscope
} from "lucide-react";

interface AILearningAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LearningContent {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  examples: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  remedy: string;
  potency: string;
  dosage: string;
  symptoms: string[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  remedy: string;
}

interface QuizResult {
  score: number;
  total: number;
  incorrectAnswers: QuizQuestion[];
}

interface CommonSymptom {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  mainRemedies: string[];
}

// Default homeopathic knowledge for common symptoms
const COMMON_SYMPTOMS: CommonSymptom[] = [
  {
    id: 'fever',
    name: 'Fever',
    icon: Thermometer,
    color: 'from-red-500 to-orange-500',
    description: 'High temperature and related symptoms',
    mainRemedies: ['Belladonna', 'Aconite', 'Ferrum Phos', 'Gelsemium']
  },
  {
    id: 'headache',
    name: 'Headache',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    description: 'Head pain and tension',
    mainRemedies: ['Bryonia', 'Belladonna', 'Natrum Mur', 'Spigelia']
  },
  {
    id: 'digestive',
    name: 'Digestive Issues',
    icon: Activity,
    color: 'from-green-500 to-teal-500',
    description: 'Stomach, nausea, and digestive problems',
    mainRemedies: ['Nux Vomica', 'Arsenicum', 'Pulsatilla', 'Carbo Veg']
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: Stethoscope,
    color: 'from-blue-500 to-cyan-500',
    description: 'Cough, cold, and breathing issues',
    mainRemedies: ['Drosera', 'Rumex', 'Spongia', 'Aconite']
  },
  {
    id: 'stress',
    name: 'Stress & Anxiety',
    icon: Heart,
    color: 'from-indigo-500 to-purple-500',
    description: 'Mental and emotional symptoms',
    mainRemedies: ['Ignatia', 'Pulsatilla', 'Natrum Mur', 'Aconite']
  },
  {
    id: 'injury',
    name: 'Injuries & Trauma',
    icon: Zap,
    color: 'from-yellow-500 to-red-500',
    description: 'Physical injuries, bruises, wounds',
    mainRemedies: ['Arnica', 'Calendula', 'Hypericum', 'Ledum']
  }
];

// Default learning content for common remedies
const DEFAULT_REMEDY_INFO: { [key: string]: Omit<LearningContent, 'id'> } = {
  'Arnica': {
    title: 'Arnica Montana - The Trauma Remedy',
    content: 'Arnica is the premier remedy for physical trauma, bruises, and shock. Known as "the trauma remedy," it helps with both physical and emotional shock from injuries. Arnica is invaluable for falls, blows, sprains, and any trauma where tissues are bruised.',
    keyPoints: [
      'First remedy to consider for any physical trauma or injury',
      'Excellent for bruises, sprains, falls, and blunt force injuries',
      'Helps reduce swelling and promotes healing',
      'Useful for shock and emotional trauma from accidents',
      'Patient may say "I\'m fine" even when clearly injured',
      'Bed feels too hard, constant restlessness from discomfort',
      'Fear of being touched due to soreness'
    ],
    examples: [
      'Sports injuries: Immediate use after falls, collisions, or muscle strains',
      'Post-surgical: Reduces bruising and promotes faster healing',
      'Dental work: Helps with pain and swelling after extractions',
      'Emotional trauma: When someone is in shock from an accident'
    ],
    difficulty: 'beginner' as const,
    remedy: 'Arnica Montana',
    potency: '30C or 200C',
    dosage: '3-4 pellets every 2-4 hours initially, then 2-3 times daily',
    symptoms: ['bruises', 'trauma', 'sprains', 'shock', 'falls', 'muscle strain']
  },
  'Belladonna': {
    title: 'Belladonna - The Acute Fever Remedy',
    content: 'Belladonna is indicated for sudden, intense conditions with heat, redness, and throbbing. It\'s the go-to remedy for high fevers that come on rapidly, intense headaches, and inflammatory conditions with marked heat and redness.',
    keyPoints: [
      'Sudden onset of symptoms - comes on like a storm',
      'High fever with burning heat, especially head and face',
      'Throbbing, pulsating pains - like a hammer in the head',
      'Face is bright red, hot, and flushed',
      'Pupils may be dilated, eyes glassy and bright',
      'Worse from light, noise, jarring, and lying down',
      'Better from sitting up and gentle motion'
    ],
    examples: [
      'High fever: Sudden fever with hot, red face and throbbing head',
      'Acute headaches: Intense, throbbing headaches with light sensitivity',
      'Sore throat: Red, hot throat that comes on suddenly',
      'Acute inflammation: Any condition with heat, redness, and throbbing'
    ],
    difficulty: 'beginner' as const,
    remedy: 'Belladonna',
    potency: '30C',
    dosage: '3-4 pellets every 1-2 hours in acute conditions',
    symptoms: ['fever', 'headache', 'inflammation', 'throbbing pain', 'red face']
  },
  'Nux Vomica': {
    title: 'Nux Vomica - The Digestive & Stress Remedy',
    content: 'Nux Vomica is the remedy for modern life stress, overindulgence, and digestive issues. It\'s perfect for busy people who overdo everything - work, food, stimulants, and stress. Known as the "hangover remedy," it helps with digestive complaints and irritability.',
    keyPoints: [
      'Ideal for Type A personalities - impatient, irritable, ambitious',
      'Digestive issues from overindulgence in food, alcohol, or coffee',
      'Constipation with constant urging but incomplete evacuation',
      'Nausea and vomiting, especially in the morning',
      'Extremely chilly - cannot get warm enough',
      'Worse in the morning, from cold, noise, and being disturbed',
      'Better from warmth, hot drinks, and being left alone'
    ],
    examples: [
      'Hangovers: After too much alcohol, coffee, or rich food',
      'Work stress: Digestive issues from deadline pressure and irregular meals',
      'Morning sickness: Nausea worse in the morning',
      'Lifestyle excess: Problems from too much of everything - work, stimulants, stress'
    ],
    difficulty: 'intermediate' as const,
    remedy: 'Nux Vomica',
    potency: '30C',
    dosage: '3-4 pellets 2-3 times daily, best taken in evening',
    symptoms: ['digestive issues', 'nausea', 'constipation', 'stress', 'irritability', 'hangover']
  }
};

export default function AILearningAssistant({ isOpen, onClose }: AILearningAssistantProps) {
  const [activeTab, setActiveTab] = useState("learn");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [learningContent, setLearningContent] = useState<LearningContent | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [showDefaultContent, setShowDefaultContent] = useState(true);
  const [selectedSymptom, setSelectedSymptom] = useState<CommonSymptom | null>(null);

  // Initialize with default content on first load
  useEffect(() => {
    if (isOpen && showDefaultContent) {
      setShowDefaultContent(true);
      setLearningContent(null);
    }
  }, [isOpen]);

  // Handle selecting a common symptom
  const handleSymptomSelect = (symptom: CommonSymptom) => {
    setSelectedSymptom(symptom);
    setShowDefaultContent(false);
    
    // Show first remedy for this symptom
    const firstRemedy = symptom.mainRemedies[0];
    if (DEFAULT_REMEDY_INFO[firstRemedy]) {
      const content: LearningContent = {
        id: `default-${Date.now()}`,
        ...DEFAULT_REMEDY_INFO[firstRemedy]
      };
      setLearningContent(content);
    }
  };

  // Handle selecting a specific remedy
  const handleRemedySelect = (remedyName: string) => {
    if (DEFAULT_REMEDY_INFO[remedyName]) {
      const content: LearningContent = {
        id: `default-${Date.now()}`,
        ...DEFAULT_REMEDY_INFO[remedyName]
      };
      setLearningContent(content);
      setShowDefaultContent(false);
    }
  };

  // Learn functionality with enhanced search
  const handleLearnSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setShowDefaultContent(false);
    
    // First check if it's a known remedy in our default content
    const knownRemedy = Object.keys(DEFAULT_REMEDY_INFO).find(
      remedy => remedy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (knownRemedy) {
      const content: LearningContent = {
        id: `default-${Date.now()}`,
        ...DEFAULT_REMEDY_INFO[knownRemedy]
      };
      setLearningContent(content);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/learning/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: searchTerm }),
      });

      if (response.ok) {
        const data = await response.json();
        setLearningContent(data);
      } else {
        console.error('Failed to fetch learning content');
      }
    } catch (error) {
      console.error('Error fetching learning content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced quiz functionality
  const handleStartQuiz = async () => {
    if (!searchTerm.trim() && !selectedSymptom) return;
    
    setIsLoading(true);
    const topic = searchTerm || selectedSymptom?.name || '';
    
    try {
      const response = await fetch('/api/learning/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuizQuestions(data.questions);
        setIsQuizStarted(true);
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setShowResults(false);
        setShowDefaultContent(false);
      } else {
        console.error('Failed to fetch quiz questions');
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let correct = 0;
    const incorrectAnswers: QuizQuestion[] = [];

    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      } else {
        incorrectAnswers.push(question);
      }
    });

    const result: QuizResult = {
      score: correct,
      total: quizQuestions.length,
      incorrectAnswers,
    };

    setQuizResult(result);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setIsQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizResult(null);
    setQuizQuestions([]);
    setShowDefaultContent(true);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 'intermediate': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 'advanced': return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const backToHome = () => {
    setShowDefaultContent(true);
    setLearningContent(null);
    setSelectedSymptom(null);
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] w-[90vw] overflow-hidden p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl">
        {/* Purple Gradient Header with Glassy Effect */}
        <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-4 shadow-lg">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="flex items-center gap-2 text-white text-lg font-bold">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm shadow-lg">
                <Brain className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
              <span className="drop-shadow-sm">AI-Enhanced Remedy Learning Assistant</span>
            </DialogTitle>
            <p className="text-purple-100 mt-1 text-sm drop-shadow-sm">
              Discover homeopathic remedies for common conditions with classical knowledge
            </p>
          </DialogHeader>
        </div>

        <div className="flex flex-col h-[calc(95vh-100px)] p-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-900/50">
          {/* Enhanced Search Input */}
          <div className="mb-3 flex-shrink-0">
            <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
              🔍 Search for remedies, conditions, or browse common symptoms below:
            </Label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  id="search"
                  placeholder="e.g., Arnica for bruises, fever remedies, Nux Vomica..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (activeTab === 'learn' ? handleLearnSearch() : handleStartQuiz())}
                  className="pl-4 pr-12 h-12 text-base bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700 focus:border-purple-400 dark:focus:border-purple-500 shadow-lg transition-all duration-300 hover:shadow-xl focus:shadow-xl"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <Button
                onClick={activeTab === 'learn' ? handleLearnSearch : handleStartQuiz}
                disabled={isLoading || !searchTerm.trim()}
                className="px-6 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {!showDefaultContent && (
                <Button
                  onClick={backToHome}
                  variant="outline"
                  className="px-4 h-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300"
                >
                  Home
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-1 shadow-lg rounded-lg border border-purple-200 dark:border-purple-700">
              <TabsTrigger 
                value="learn" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300 rounded-md"
              >
                <BookOpen className="h-4 w-4" />
                Learn
              </TabsTrigger>
              <TabsTrigger 
                value="quiz" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white transition-all duration-300 rounded-md"
              >
                <Target className="h-4 w-4" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-2 h-[calc(95vh-220px)] min-h-[700px] pr-4 [&>[data-radix-scroll-area-viewport]]:max-h-[calc(95vh-220px)]">
              <TabsContent value="learn" className="mt-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4 shadow-lg"></div>
                        <div className="absolute inset-0 rounded-full bg-purple-100/50 animate-pulse"></div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">✨ Gathering learning materials...</p>
                    </div>
                  </div>
                ) : showDefaultContent ? (
                  <div className="space-y-6">
                    {/* Welcome Message */}
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-xl">
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Welcome to Homeopathic Learning! 🌿
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore common symptoms and discover their main homeopathic remedies. Click on any condition below to start learning!
                      </p>
                    </div>

                    {/* Common Symptoms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {COMMON_SYMPTOMS.map((symptom) => {
                        const IconComponent = symptom.icon;
                        return (
                          <Card 
                            key={symptom.id}
                            className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-800/50"
                            onClick={() => handleSymptomSelect(symptom)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-lg bg-gradient-to-r ${symptom.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                  <IconComponent className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                    {symptom.name}
                                  </CardTitle>
                                  <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                    {symptom.description}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Main Remedies:</p>
                                <div className="flex flex-wrap gap-2">
                                  {symptom.mainRemedies.slice(0, 3).map((remedy) => (
                                    <Badge 
                                      key={remedy}
                                      variant="secondary"
                                      className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemedySelect(remedy);
                                      }}
                                    >
                                      {remedy}
                                    </Badge>
                                  ))}
                                  {symptom.mainRemedies.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{symptom.mainRemedies.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Quick Tips */}
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Lightbulb className="h-6 w-6 text-yellow-500" />
                          <h3 className="font-bold text-gray-800 dark:text-gray-200">Quick Learning Tips</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                          <div className="space-y-2">
                            <p>💡 <strong>Start with basics:</strong> Learn Arnica, Belladonna, and Nux Vomica first</p>
                            <p>🎯 <strong>Focus on symptoms:</strong> Each remedy has unique symptom patterns</p>
                          </div>
                          <div className="space-y-2">
                            <p>📚 <strong>Practice regularly:</strong> Use the quiz feature to test your knowledge</p>
                            <p>🔍 <strong>Search anytime:</strong> Use the search box for specific topics</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : learningContent ? (
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200 dark:border-purple-700 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg">
                            <Lightbulb className="h-5 w-5 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                            {learningContent.title}
                          </span>
                        </CardTitle>
                        <Badge className={`${getDifficultyColor(learningContent.difficulty)} shadow-lg`}>
                          {learningContent.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                        📚 Comprehensive guide to understanding this remedy
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 p-8">
                      {/* Remedy Info Bar */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remedy</p>
                          <p className="font-bold text-purple-600 dark:text-purple-400">{learningContent.remedy}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Potency</p>
                          <p className="font-bold text-indigo-600 dark:text-indigo-400">{learningContent.potency}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dosage</p>
                          <p className="font-bold text-green-600 dark:text-green-400 text-sm">{learningContent.dosage}</p>
                        </div>
                      </div>

                      {/* Overview */}
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-3 text-gray-800 dark:text-gray-200">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                            <BookOpen className="h-4 w-4 text-white" />
                          </div>
                          Overview
                        </h3>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700 shadow-lg">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">{learningContent.content}</p>
                        </div>
                      </div>

                      {/* Key Points */}
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-3 text-gray-800 dark:text-gray-200">
                          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          Key Points to Remember
                        </h3>
                        <div className="grid gap-3">
                          {learningContent.keyPoints.map((point, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300">
                              <div className="h-3 w-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mt-2 shrink-0 shadow-lg"></div>
                              <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Practical Examples */}
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-3 text-gray-800 dark:text-gray-200">
                          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
                            <Award className="h-4 w-4 text-white" />
                          </div>
                          Practical Examples
                        </h3>
                        <div className="grid gap-4">
                          {learningContent.examples.map((example, index) => (
                            <div key={index} className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{example}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Related Symptoms */}
                      {learningContent.symptoms && learningContent.symptoms.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-bold text-lg flex items-center gap-3 text-gray-800 dark:text-gray-200">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg shadow-lg">
                              <Stethoscope className="h-4 w-4 text-white" />
                            </div>
                            Related Symptoms
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {learningContent.symptoms.map((symptom, index) => (
                              <Badge 
                                key={index}
                                className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 dark:from-indigo-900/30 dark:to-blue-900/30 dark:text-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              >
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Ready to start learning!</p>
                    <p className="text-sm text-gray-500">
                      Search for any homeopathic remedy or condition to get detailed learning materials.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="quiz" className="mt-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mx-auto mb-4 shadow-lg"></div>
                        <div className="absolute inset-0 rounded-full bg-green-100/50 animate-pulse"></div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">🎯 Preparing your quiz...</p>
                    </div>
                  </div>
                ) : showResults ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        Quiz Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className={`text-4xl font-bold mb-2 ${getScoreColor((quizResult!.score / quizResult!.total) * 100)}`}>
                          {quizResult!.score}/{quizResult!.total}
                        </div>
                        <p className="text-gray-600 mb-4">
                          You scored {Math.round((quizResult!.score / quizResult!.total) * 100)}%
                        </p>
                        <Progress 
                          value={(quizResult!.score / quizResult!.total) * 100} 
                          className="h-3"
                        />
                      </div>

                      {quizResult!.incorrectAnswers.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                            Review These Topics
                          </h3>
                          <div className="space-y-3">
                            {quizResult!.incorrectAnswers.map((question, index) => (
                              <div key={index} className="bg-red-50 p-4 rounded-lg">
                                <p className="font-medium text-gray-800 mb-2">{question.question}</p>
                                <p className="text-sm text-gray-600 mb-2">
                                  <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                                </p>
                                <p className="text-sm text-gray-700">{question.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button onClick={resetQuiz} variant="outline" className="flex-1">
                          Take Another Quiz
                        </Button>
                        <Button 
                          onClick={() => setActiveTab('learn')} 
                          className="flex-1"
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : isQuizStarted && quizQuestions.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-green-600" />
                          Question {currentQuestionIndex + 1} of {quizQuestions.length}
                        </CardTitle>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Quiz Mode
                        </Badge>
                      </div>
                      <Progress value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} className="h-2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          {quizQuestions[currentQuestionIndex]?.question}
                        </h3>
                        <div className="space-y-3">
                          {quizQuestions[currentQuestionIndex]?.options.map((option, index) => (
                            <Button
                              key={index}
                              variant={selectedAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                              className="w-full text-left justify-start h-auto p-4"
                              onClick={() => handleAnswerSelect(index)}
                            >
                              <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                          disabled={currentQuestionIndex === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={handleNextQuestion}
                          disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        >
                          {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : showDefaultContent ? (
                  <div className="space-y-6">
                    {/* Quiz Welcome */}
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <div className="inline-block p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-xl">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        Ready to Test Your Knowledge? 🎯
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Choose a symptom category below to start a quiz, or search for a specific topic above!
                      </p>
                    </div>

                    {/* Quiz Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {COMMON_SYMPTOMS.map((symptom) => {
                        const IconComponent = symptom.icon;
                        return (
                          <Card 
                            key={symptom.id}
                            className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-green-200 dark:border-green-700 shadow-lg hover:shadow-green-200/50 dark:hover:shadow-green-800/50"
                            onClick={() => {
                              setSelectedSymptom(symptom);
                              handleStartQuiz();
                            }}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-lg bg-gradient-to-r ${symptom.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                  <IconComponent className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                    Quiz: {symptom.name}
                                  </CardTitle>
                                  <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                    Test your {symptom.name.toLowerCase()} knowledge
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Questions about: {symptom.description}
                              </p>
                              <Button 
                                size="sm" 
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                              >
                                Start Quiz 🚀
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Quiz Tips */}
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Target className="h-6 w-6 text-green-500" />
                          <h3 className="font-bold text-gray-800 dark:text-gray-200">Quiz Features</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                          <div className="space-y-2">
                            <p>🎯 <strong>Multiple Choice:</strong> Choose the best answer from 4 options</p>
                            <p>📊 <strong>Instant Results:</strong> See your score and detailed explanations</p>
                          </div>
                          <div className="space-y-2">
                            <p>🔄 <strong>Retry Anytime:</strong> Take quizzes multiple times to improve</p>
                            <p>📚 <strong>Learn & Test:</strong> Switch between Learn and Quiz tabs easily</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <div className="inline-block p-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full shadow-xl">
                        <Target className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">🎯 Test your knowledge!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Search for a topic above to generate a personalized quiz based on your learning.
                    </p>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}