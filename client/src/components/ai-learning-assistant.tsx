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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  Book,
  Target,
  Search,
  ArrowRight,
  Check,
  Pill,
  AlertCircle,
  ArrowLeft,
  Star,
  Droplets
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

// Default common symptoms for browsing
const COMMON_SYMPTOMS: CommonSymptom[] = [
  {
    id: 'headache',
    name: 'Headache',
    icon: AlertCircle,
    color: 'text-red-500',
    description: 'Various types of headaches including tension, migraine, and cluster headaches',
    mainRemedies: ['Belladonna', 'Bryonia', 'Gelsemium', 'Natrum Muriaticum']
  },
  {
    id: 'cough',
    name: 'Cough',
    icon: Droplets,
    color: 'text-blue-500',
    description: 'Dry, wet, or spasmodic cough from various causes',
    mainRemedies: ['Bryonia', 'Phosphorus', 'Drosera', 'Rumex Crispus']
  },
  {
    id: 'indigestion',
    name: 'Digestive Issues',
    icon: Pill,
    color: 'text-amber-500',
    description: 'Indigestion, bloating, nausea, and other digestive complaints',
    mainRemedies: ['Nux Vomica', 'Lycopodium', 'Carbo Vegetabilis', 'Pulsatilla']
  },
  {
    id: 'anxiety',
    name: 'Anxiety & Stress',
    icon: Brain,
    color: 'text-purple-500',
    description: 'Nervousness, anxiety, panic attacks, and stress-related symptoms',
    mainRemedies: ['Aconite', 'Argentum Nitricum', 'Arsenicum Album', 'Gelsemium']
  },
  {
    id: 'insomnia',
    name: 'Sleep Issues',
    icon: Star,
    color: 'text-indigo-500',
    description: 'Difficulty falling asleep, staying asleep, or restless sleep',
    mainRemedies: ['Coffea Cruda', 'Passiflora', 'Avena Sativa', 'Chamomilla']
  },
];

// Default remedy information for offline/example usage
const DEFAULT_REMEDY_INFO: Record<string, Omit<LearningContent, 'id'>> = {
  'Belladonna': {
    title: 'Belladonna (Deadly Nightshade)',
    content: 'Belladonna is one of the most important remedies for acute conditions characterized by sudden onset, intense symptoms, heat, redness, and throbbing pain. It is particularly useful for conditions that come on suddenly and with great intensity.',
    keyPoints: [
      'Sudden, violent onset of symptoms',
      'Intense heat, redness, and burning',
      'Throbbing, pulsating pains',
      'Hypersensitivity to light, noise, and touch',
      'Dilated pupils and flushed face'
    ],
    examples: [
      'High fever with hot, red skin',
      'Throbbing headaches worse from motion, noise, or light',
      'Sore throat with bright redness and difficulty swallowing',
      'Earache with throbbing pain and redness'
    ],
    difficulty: 'beginner',
    remedy: 'Belladonna',
    potency: '30C',
    dosage: 'For acute conditions: 3-4 pellets every 1-2 hours, decreasing frequency as symptoms improve. For severe conditions: every 15-30 minutes for up to 3 doses, then less frequently.',
    symptoms: ['fever', 'headache', 'throbbing pain', 'redness', 'heat', 'inflammation']
  },
  'Arnica Montana': {
    title: 'Arnica Montana (Leopard\'s Bane)',
    content: 'Arnica is the first remedy to consider for injuries, trauma, and their effects. It addresses the shock and tissue damage from injuries and helps reduce pain, swelling, and bruising. It\'s excellent for the physical and emotional effects of trauma.',
    keyPoints: [
      'First remedy for injuries, falls, and trauma',
      'Reduces bruising, swelling, and soreness',
      'Addresses shock after injury or surgery',
      'Helps with overexertion and muscle soreness',
      'Patient often says they are "fine" even when clearly injured'
    ],
    examples: [
      'Bruises and sprains',
      'Post-surgical recovery',
      'Sports injuries and muscle soreness',
      'Head injuries and concussion (seek medical care first)',
      'Dental procedures and extractions'
    ],
    difficulty: 'beginner',
    remedy: 'Arnica Montana',
    potency: '30C',
    dosage: 'For injuries: 3-4 pellets every 1-2 hours initially, then 3 times daily as symptoms improve. Before/after surgery: 3-4 pellets twice daily starting 2 days before and continuing for several days after.',
    symptoms: ['bruising', 'trauma', 'injury', 'soreness', 'shock', 'muscle pain']
  },
  'Nux Vomica': {
    title: 'Nux Vomica (Poison Nut)',
    content: 'Nux Vomica is one of the most important remedies for digestive disturbances, especially those related to overindulgence, stress, or irregular habits. It is particularly suited to the effects of modern lifestyle - overwork, excessive eating, alcohol, coffee, and other stimulants.',
    keyPoints: [
      'Great for digestive upset from overindulgence',
      'Helps with hangover symptoms',
      'Relieves constipation with ineffectual urging',
      'Addresses irritability and hypersensitivity',
      'Suited to Type-A personalities who are ambitious and easily stressed'
    ],
    examples: [
      'Indigestion from rich food or alcohol',
      'Constipation with frequent, unsuccessful urges',
      'Hangover symptoms with headache and nausea',
      'Insomnia from mental strain, waking at 3-4am',
      'Irritability with sensitivity to noise, light, and odors'
    ],
    difficulty: 'beginner',
    remedy: 'Nux Vomica',
    potency: '30C',
    dosage: 'For acute digestive issues: 3-4 pellets every 1-2 hours, reducing frequency as symptoms improve. For hangovers: 3-4 pellets before bed and upon waking.',
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
    const topic = searchTerm.trim() || selectedSymptom?.name || '';
    if (!topic) return;
    
    setIsLoading(true);
    setShowDefaultContent(false);
    
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
        if (data.questions && data.questions.length > 0) {
          setQuizQuestions(data.questions);
          setIsQuizStarted(true);
          setCurrentQuestionIndex(0);
          setSelectedAnswers([]);
          setShowResults(false);
        } else {
          console.error('No quiz questions received');
        }
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

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden border-none">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-4 shadow-lg">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 justify-center">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm shadow-lg">
                <Brain className="h-6 w-6 text-white drop-shadow-sm" />
              </div>
              <div className="text-center">
                <h1 className="text-white text-xl font-bold tracking-wide">AI-Enhanced Remedy Learning Assistant</h1>
                <p className="text-purple-100 text-sm">
                  Discover homeopathic remedies for common conditions with classical knowledge
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
        </div>

        {/* Content Area */}
        <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-900/50 max-h-[80vh] overflow-auto">
          <div className="p-4">
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
                  🔍 Search for remedies, conditions, or browse common symptoms below:
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="e.g., Arnica, headache, fever..."
                    className="flex-1"
                  />
                  {activeTab === "learn" ? (
                    <Button onClick={handleLearnSearch} disabled={isLoading}>
                      {isLoading ? "Searching..." : "Search"}
                    </Button>
                  ) : (
                    <Button onClick={handleStartQuiz} disabled={isLoading}>
                      {isLoading ? "Generating..." : "Start Quiz"}
                    </Button>
                  )}
                </div>
              </div>

              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {/* Learn Tab Content */}
                  <TabsContent value="learn" className="mt-0">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-pulse flex flex-col items-center">
                          <div className="rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 h-12 w-12 mb-4"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-3"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                        </div>
                      </div>
                    ) : showDefaultContent ? (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {COMMON_SYMPTOMS.map((symptom) => (
                            <Card
                              key={symptom.id}
                              className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]"
                              onClick={() => handleSymptomSelect(symptom)}
                            >
                              <CardHeader className="p-4 pb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full bg-opacity-20 ${symptom.color.replace('text-', 'bg-')}`}>
                                    <symptom.icon className={`h-5 w-5 ${symptom.color}`} />
                                  </div>
                                  <CardTitle className="text-lg">{symptom.name}</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <CardDescription className="text-sm mb-2">{symptom.description}</CardDescription>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {symptom.mainRemedies.map((remedy) => (
                                    <Badge
                                      key={remedy}
                                      variant="outline"
                                      className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemedySelect(remedy);
                                      }}
                                    >
                                      {remedy}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <Card className="mb-6">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-lg">Popular Remedies</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-1">
                            <div className="flex flex-wrap gap-2">
                              {Object.keys(DEFAULT_REMEDY_INFO).map((remedy) => (
                                <Badge
                                  key={remedy}
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 py-1.5"
                                  onClick={() => handleRemedySelect(remedy)}
                                >
                                  {remedy}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : learningContent ? (
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-1"
                          onClick={backToHome}
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to Browse
                        </Button>
                        <Card className="mb-6">
                          <CardHeader className="p-5 pb-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl text-purple-800 dark:text-purple-300">
                                  {learningContent.title}
                                </CardTitle>
                                <div className="flex gap-2 mt-2">
                                  <Badge className={getDifficultyColor(learningContent.difficulty)}>
                                    {learningContent.difficulty.charAt(0).toUpperCase() + learningContent.difficulty.slice(1)}
                                  </Badge>
                                  <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50">
                                    {learningContent.potency}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-5 pt-3">
                            <div className="text-gray-700 dark:text-gray-300 mb-4">
                              {learningContent.content}
                            </div>
                            
                            <div className="mb-4">
                              <h3 className="font-semibold text-lg mb-2 text-purple-700 dark:text-purple-400">Key Points</h3>
                              <ul className="space-y-1">
                                {learningContent.keyPoints.map((point, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-600 dark:text-green-500 mt-1 flex-shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="mb-4">
                              <h3 className="font-semibold text-lg mb-2 text-purple-700 dark:text-purple-400">Common Uses</h3>
                              <ul className="space-y-1">
                                {learningContent.examples.map((example, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-500 mt-1 flex-shrink-0" />
                                    <span>{example}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-lg mb-2 text-purple-700 dark:text-purple-400">Dosage & Administration</h3>
                              <div className="text-gray-700 dark:text-gray-300 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                                {learningContent.dosage}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="mb-4">
                          <div className="inline-block p-4 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full shadow-xl">
                            <Search className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">Search for a remedy or symptom</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enter a remedy name, symptom, or condition to learn more about homeopathic treatments.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Quiz Tab Content */}
                  <TabsContent value="quiz" className="mt-0">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-pulse flex flex-col items-center">
                          <div className="rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 h-12 w-12 mb-4"></div>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-3"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                        </div>
                      </div>
                    ) : isQuizStarted ? (
                      showResults ? (
                        <div>
                          <Card className="mb-6">
                            <CardHeader className="p-5 pb-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
                              <CardTitle className="text-xl">Quiz Results</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                              <div className="text-center mb-6">
                                <div className="text-4xl font-bold mb-2 transition-all duration-700 ease-out transform translate-y-0 opacity-100 scale-100">
                                  <span className={getScoreColor(quizResult ? (quizResult.score / quizResult.total) * 100 : 0)}>
                                    {quizResult?.score}
                                  </span>
                                  <span className="text-gray-500 dark:text-gray-400">/{quizResult?.total}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300">
                                  {quizResult && quizResult.score === quizResult.total
                                    ? "Perfect score! Excellent knowledge of homeopathic remedies."
                                    : quizResult && quizResult.score >= quizResult.total * 0.7
                                    ? "Great job! You have a good understanding of homeopathic remedies."
                                    : "Keep learning! Review the remedies to improve your knowledge."}
                                </p>
                              </div>
                              
                              {quizResult && quizResult.incorrectAnswers.length > 0 && (
                                <div>
                                  <h3 className="font-semibold text-lg mb-3 text-purple-700 dark:text-purple-400">
                                    Review Incorrect Answers
                                  </h3>
                                  <div className="space-y-4">
                                    {quizResult.incorrectAnswers.map((question, idx) => (
                                      <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                                        <p className="font-medium mb-2 text-gray-800 dark:text-gray-200">{question.question}</p>
                                        <div className="mb-2">
                                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Correct answer:</p>
                                          <p className="text-green-600 dark:text-green-500 font-medium pl-4 border-l-2 border-green-500">
                                            {question.options[question.correctAnswer]}
                                          </p>
                                        </div>
                                        <p className="text-sm italic text-gray-600 dark:text-gray-400">{question.explanation}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <Button 
                                onClick={resetQuiz} 
                                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                              >
                                Try Another Quiz
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div>
                          <Card>
                            <CardHeader className="p-5 pb-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">
                                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                                </CardTitle>
                                <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50">
                                  {quizQuestions[currentQuestionIndex]?.remedy || "General Knowledge"}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-5">
                              <p className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                                {quizQuestions[currentQuestionIndex]?.question}
                              </p>
                              <div className="space-y-2">
                                {quizQuestions[currentQuestionIndex]?.options.map((option, index) => (
                                  <Button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    variant={selectedAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                                    className="w-full text-left justify-start p-4 h-auto"
                                  >
                                    <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                                    {option}
                                  </Button>
                                ))}
                                <Button
                                  onClick={handleNextQuestion}
                                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                >
                                  {currentQuestionIndex === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                                </Button>
                              </CardContent>
                            </CardContent>
                          </Card>
                        </div>
                      )
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
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}