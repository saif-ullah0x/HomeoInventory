import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Brain, 
  Star, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Award,
  Lightbulb,
  Heart,
  Leaf
} from "lucide-react";

interface RemedyLearningSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface UserProgress {
  completedRemedies: number[];
  totalQuestions: number;
  correctAnswers: number;
  level: string;
  streak: number;
}

interface Remedy {
  id: number;
  name: string;
  fullName: string;
  category: string;
  description: string;
  keyUses: string[];
  symptoms: string[];
  mentalSymptoms: string[];
  physicalSymptoms: string[];
  modalities: {
    worse: string[];
    better: string[];
  };
  potencies: string[];
  dosage: string;
  source: string;
  imageUrl?: string;
}

// Homeopathic remedies database
// Sample quiz questions for each remedy
const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the primary indication for Arnica Montana?",
    options: [
      "Fever with thirst",
      "Trauma and bruising",
      "Headache with nausea",
      "Anxiety with restlessness"
    ],
    correctAnswer: 1,
    explanation: "Arnica Montana is primarily indicated for trauma, bruising, and physical injuries. It helps with the shock and soreness that follows injuries.",
    difficulty: "beginner"
  },
  {
    id: 2,
    question: "Which of the following is a characteristic mental symptom of Arnica?",
    options: [
      "Fear of death",
      "Irritability and anger",
      "Saying 'I am fine' when clearly injured",
      "Confusion about identity"
    ],
    correctAnswer: 2,
    explanation: "A characteristic mental symptom of Arnica is that the patient often says they are fine or refuses help when they are clearly injured.",
    difficulty: "intermediate"
  },
  {
    id: 3,
    question: "What condition is Aconitum Napellus best known for treating?",
    options: [
      "Chronic joint pain",
      "Sudden illness with fear after exposure to cold wind",
      "Digestive disorders",
      "Skin conditions"
    ],
    correctAnswer: 1,
    explanation: "Aconitum is best known for treating sudden, violent onset of symptoms, particularly after exposure to cold, dry wind. Fear and restlessness are key symptoms.",
    difficulty: "beginner"
  },
  {
    id: 4,
    question: "Which of these is a key modality for Belladonna?",
    options: [
      "Better from cold applications",
      "Worse from light and noise",
      "Better from eating",
      "Worse from rest"
    ],
    correctAnswer: 1,
    explanation: "Belladonna symptoms are typically worse from light, noise, touch, and jarring. The affected parts are often hot, red, and throbbing.",
    difficulty: "intermediate"
  }
];

const REMEDIES_DATABASE: Remedy[] = [
  {
    id: 1,
    name: "Arnica Montana",
    fullName: "Arnica montana (Mountain Arnica)",
    category: "Trauma & Injuries",
    description: "The great trauma remedy of homeopathy. Arnica is the first remedy to think of for any injury, whether recent or remote. It promotes healing and reduces shock from trauma.",
    keyUses: [
      "Bruises and contusions",
      "Sprains and strains", 
      "Post-surgical recovery",
      "Overexertion and fatigue",
      "Shock from injury"
    ],
    symptoms: [
      "Body feels beaten and sore",
      "Everything feels hard when lying down",
      "Dreads being touched",
      "Says nothing is wrong when clearly injured"
    ],
    mentalSymptoms: [
      "Shock and trauma",
      "Denies severity of condition",
      "Irritable and impatient",
      "Fear of being touched"
    ],
    physicalSymptoms: [
      "Bruising and ecchymosis",
      "Muscular soreness",
      "Joint stiffness",
      "Hemorrhage from injury"
    ],
    modalities: {
      worse: ["Touch", "Motion", "Rest", "Wine"],
      better: ["Lying down", "Lying with head low"]
    },
    potencies: ["6C", "30C", "200C"],
    dosage: "3-5 pellets under tongue",
    source: "Boericke's Materia Medica"
  },
  {
    id: 2,
    name: "Aconitum Napellus",
    fullName: "Aconitum napellus (Monkshood)",
    category: "Acute Conditions",
    description: "The great remedy for sudden, violent onset of symptoms with fear and restlessness. Think of Aconite when illness comes on suddenly after exposure to cold, dry wind.",
    keyUses: [
      "Sudden onset fever",
      "Panic attacks",
      "Acute inflammatory conditions",
      "Colds from cold, dry wind",
      "Fear and shock"
    ],
    symptoms: [
      "Sudden violent onset",
      "High fever with thirst",
      "Great fear and anxiety",
      "Restlessness and agitation"
    ],
    mentalSymptoms: [
      "Great fear and fright",
      "Predicts time of death",
      "Restless and anxious",
      "Fear of crowds"
    ],
    physicalSymptoms: [
      "High fever with dry heat",
      "Intense thirst for cold water",
      "Hot dry skin",
      "Rapid pulse"
    ],
    modalities: {
      worse: ["Evening", "Dry cold winds", "Fright"],
      better: ["Open air", "Rest"]
    },
    potencies: ["6C", "30C", "200C"],
    dosage: "3-5 pellets every 15-30 minutes in acute states",
    source: "Boericke's Materia Medica"
  },
  {
    id: 3,
    name: "Belladonna",
    fullName: "Atropa belladonna (Deadly Nightshade)",
    category: "Acute Fevers",
    description: "The remedy for sudden, violent inflammatory conditions with heat, redness, and throbbing. Classic for high fevers and intense headaches.",
    keyUses: [
      "High fever with delirium",
      "Throbbing headaches",
      "Acute inflammations",
      "Sore throat",
      "Hot, red, swollen conditions"
    ],
    symptoms: [
      "Sudden violent onset",
      "Bright red face and skin",
      "Throbbing pain",
      "No thirst despite fever"
    ],
    mentalSymptoms: [
      "Delirium with fever",
      "Sees monsters and hideous faces",
      "Bites and strikes",
      "Restless sleep"
    ],
    physicalSymptoms: [
      "Bright red, hot skin",
      "Dilated pupils", 
      "Throbbing pulse",
      "Dry mouth without thirst"
    ],
    modalities: {
      worse: ["Touch", "Jar", "Noise", "Light"],
      better: ["Semi-erect position"]
    },
    potencies: ["6C", "30C", "200C"],
    dosage: "3-5 pellets every 30 minutes in acute fever",
    source: "Boericke's Materia Medica"
  }
];

export default function RemedyLearningSystem({ isOpen, onClose }: RemedyLearningSystemProps) {
  const [selectedRemedyId, setSelectedRemedyId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentView, setCurrentView] = useState<'study' | 'quiz'>('study');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedRemedies: [],
    totalQuestions: 0,
    correctAnswers: 0,
    level: 'beginner',
    streak: 0
  });

  // Get the selected remedy
  const selectedRemedy = selectedRemedyId 
    ? REMEDIES_DATABASE.find(r => r.id === selectedRemedyId) 
    : null;
    
  // Get questions for the selected remedy
  const remedyQuestions = selectedRemedyId
    ? QUESTIONS.filter(q => q.question.includes(REMEDIES_DATABASE.find(r => r.id === selectedRemedyId)?.name || ''))
    : [];

  const startStudy = (remedy: Remedy) => {
    setSelectedRemedyId(remedy.id);
    setCurrentView('study');
  };

  const startQuiz = () => {
    if (remedyQuestions.length > 0) {
      setCurrentQuestion(remedyQuestions[0]);
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentView('quiz');
    }
  };

  const backToOverview = () => {
    setSelectedRemedyId(null);
    setCurrentView('study');
  };
  
  const backToStudy = () => {
    setCurrentView('study');
    setCurrentQuestion(null);
  };

  const handleAnswerSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const checkAnswer = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
      if (currentQuestion && selectedAnswer === currentQuestion.correctAnswer) {
        setUserProgress(prev => ({
          ...prev,
          correctAnswers: prev.correctAnswers + 1,
          totalQuestions: prev.totalQuestions + 1,
          streak: prev.streak + 1
        }));
      } else {
        setUserProgress(prev => ({
          ...prev,
          totalQuestions: prev.totalQuestions + 1,
          streak: 0
        }));
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion) {
      const currentIndex = remedyQuestions.findIndex(q => q.id === currentQuestion.id);
      if (currentIndex < remedyQuestions.length - 1) {
        setCurrentQuestion(remedyQuestions[currentIndex + 1]);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz completed
        if (selectedRemedyId && !userProgress.completedRemedies.includes(selectedRemedyId)) {
          setUserProgress(prev => ({
            ...prev,
            completedRemedies: [...prev.completedRemedies, selectedRemedyId]
          }));
        }
        setCurrentView('study');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <DialogTitle className="text-2xl font-bold text-center">
            Remedy Learning Center
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {selectedRemedy ? (
            // Study View
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <Button
                    variant="ghost"
                    onClick={backToOverview}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Overview
                  </Button>
                  <Badge className="bg-purple-100 text-purple-800">
                    {selectedRemedy.category}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedRemedy.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {selectedRemedy.fullName}
                  </p>
                </div>
              </div>

              {/* Content with Tabs */}
              <div className="border-b">
                <div className="flex overflow-x-auto">
                  <TabsList className="bg-transparent p-0 h-auto">
                    <TabsTrigger 
                      value="overview" 
                      onClick={() => setActiveTab("overview")}
                      className={`px-4 py-2 rounded-none border-b-2 ${activeTab === "overview" ? "border-purple-600 text-purple-700" : "border-transparent"}`}
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="symptoms" 
                      onClick={() => setActiveTab("symptoms")}
                      className={`px-4 py-2 rounded-none border-b-2 ${activeTab === "symptoms" ? "border-purple-600 text-purple-700" : "border-transparent"}`}
                    >
                      Symptoms
                    </TabsTrigger>
                    <TabsTrigger 
                      value="modalities" 
                      onClick={() => setActiveTab("modalities")}
                      className={`px-4 py-2 rounded-none border-b-2 ${activeTab === "modalities" ? "border-purple-600 text-purple-700" : "border-transparent"}`}
                    >
                      Modalities
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              {/* Scrollable Content Area */}
              <ScrollArea className="flex-1 overflow-auto">
                <div className="p-4 space-y-4">
                  {activeTab === "overview" && (
                    <>
                      {/* Description */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                            Overview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {selectedRemedy.description}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Key Uses */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Key Uses
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {selectedRemedy.keyUses.map((use, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <div className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <CheckCircle2 className="h-3 w-3" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">{use}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {activeTab === "symptoms" && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            Mental & Emotional Symptoms
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedRemedy.mentalSymptoms.map((symptom, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <div className="bg-red-100 text-red-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs">{index + 1}</span>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">{symptom}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-blue-500" />
                            Physical Symptoms
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedRemedy.physicalSymptoms.map((symptom, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <div className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs">{index + 1}</span>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">{symptom}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeTab === "modalities" && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            Worse From
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedRemedy.modalities.worse.map((item, index) => (
                              <Badge key={index} variant="outline" className="mr-2 mb-2 bg-red-50 text-red-800 border-red-200">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Better From
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedRemedy.modalities.better.map((item, index) => (
                              <Badge key={index} variant="outline" className="mr-2 mb-2 bg-green-50 text-green-800 border-green-200">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            Potencies & Dosage
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {selectedRemedy.potencies.map((potency, index) => (
                              <Badge key={index} className="bg-purple-100 text-purple-800">
                                {potency}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mt-2">
                            <span className="font-medium">Recommended dosage:</span> {selectedRemedy.dosage}
                          </p>
                        </CardContent>
                      </Card>
                      
                      {/* Test Your Knowledge Button */}
                      <div className="mt-6 flex justify-center">
                        <Button 
                          onClick={startQuiz}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Brain className="mr-2 h-4 w-4" />
                          Test Your Knowledge
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            // Overview
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Master homeopathic remedies through interactive lessons from Boericke's Materia Medica. 
                    Study remedy profiles, symptoms, and understand the key uses for each remedy.
                  </p>
                </div>

                {/* Progress Overview */}
                <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      Learning Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">0</div>
                        <div className="text-sm text-gray-600">Remedies Studied</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">0%</div>
                        <div className="text-sm text-gray-600">Completion</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">0</div>
                        <div className="text-sm text-gray-600">Study Sessions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">Beginner</div>
                        <div className="text-sm text-gray-600">Current Level</div>
                      </div>
                    </div>
                    <Progress value={0} className="h-2" />
                  </CardContent>
                </Card>

                {/* Remedy Categories */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {REMEDIES_DATABASE.map((remedy) => (
                    <Card key={remedy.id} className="hover:shadow-lg transition-shadow cursor-pointer border-purple-100 hover:border-purple-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">{remedy.name}</CardTitle>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              {remedy.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {remedy.description}
                        </p>
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Key Uses:</div>
                          <div className="flex flex-wrap gap-1">
                            {remedy.keyUses.slice(0, 3).map((use, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {use}
                              </Badge>
                            ))}
                            {remedy.keyUses.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{remedy.keyUses.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button 
                          onClick={() => startStudy(remedy)}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Study Remedy
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}