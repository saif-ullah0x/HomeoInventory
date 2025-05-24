import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Brain, 
  Star, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
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

interface Question {
  id: number;
  remedyId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface UserProgress {
  currentRemedy: number;
  completedRemedies: number[];
  currentScore: number;
  totalQuestions: number;
  correctAnswers: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  streak: number;
}

// Comprehensive Boericke's Materia Medica Database
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

// Question Bank for Each Remedy
const QUESTIONS_DATABASE: Question[] = [
  // Arnica Questions
  {
    id: 1,
    remedyId: 1,
    question: "What is the primary indication for Arnica Montana?",
    options: ["Digestive issues", "Trauma and injuries", "Skin conditions", "Respiratory problems"],
    correctAnswer: 1,
    explanation: "Arnica is the premier trauma remedy in homeopathy, used for bruises, sprains, and any injury with soreness.",
    difficulty: "beginner"
  },
  {
    id: 2,
    remedyId: 1,
    question: "A key mental symptom of Arnica is:",
    options: ["Extreme anxiety", "Denies severity of condition", "Depression", "Confusion"],
    correctAnswer: 1,
    explanation: "Arnica patients often deny they are hurt or say 'I'm fine' even when clearly injured.",
    difficulty: "intermediate"
  },
  {
    id: 3,
    remedyId: 1,
    question: "What makes an Arnica patient feel worse?",
    options: ["Cold air", "Touch and motion", "Eating", "Lying down"],
    correctAnswer: 1,
    explanation: "Arnica patients are extremely sensitive to touch and movement worsens their condition.",
    difficulty: "intermediate"
  },
  // Aconite Questions
  {
    id: 4,
    remedyId: 2,
    question: "Aconitum Napellus is best known for treating:",
    options: ["Chronic conditions", "Sudden onset acute conditions", "Digestive problems", "Skin disorders"],
    correctAnswer: 1,
    explanation: "Aconite is the remedy for sudden, violent onset of symptoms, especially after fright or cold wind exposure.",
    difficulty: "beginner"
  },
  {
    id: 5,
    remedyId: 2,
    question: "The characteristic mental state of Aconite includes:",
    options: ["Calmness", "Great fear and restlessness", "Sadness", "Irritability"],
    correctAnswer: 1,
    explanation: "Aconite patients experience intense fear, often predicting their time of death, with great restlessness.",
    difficulty: "intermediate"
  },
  // Belladonna Questions
  {
    id: 6,
    remedyId: 3,
    question: "A key physical symptom of Belladonna is:",
    options: ["Cold, clammy skin", "Bright red, hot skin", "Pale complexion", "Blue lips"],
    correctAnswer: 1,
    explanation: "Belladonna is characterized by bright red, hot, burning skin with intense heat and inflammation.",
    difficulty: "beginner"
  }
];

export default function RemedyLearningSystem({ isOpen, onClose }: RemedyLearningSystemProps) {
  const [currentView, setCurrentView] = useState<'overview' | 'study' | 'quiz'>('overview');
  const [selectedRemedy, setSelectedRemedy] = useState<Remedy | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentRemedy: 0,
    completedRemedies: [],
    currentScore: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    level: 'beginner',
    streak: 0
  });

  // TODO: Replace with Neon database connection
  // const { data: remedies } = useQuery({
  //   queryKey: ['/api/remedies'],
  //   enabled: isOpen
  // });
  // 
  // const { data: questions } = useQuery({
  //   queryKey: ['/api/questions', selectedRemedy?.id],
  //   enabled: !!selectedRemedy
  // });

  const getRemedyQuestions = (remedyId: number) => {
    return QUESTIONS_DATABASE.filter(q => q.remedyId === remedyId);
  };

  const getRandomQuestion = (remedyId: number) => {
    const questions = getRemedyQuestions(remedyId);
    const filteredQuestions = questions.filter(q => q.difficulty === userProgress.level);
    if (filteredQuestions.length === 0) return questions[0];
    
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex];
  };

  const startStudy = (remedy: Remedy) => {
    setSelectedRemedy(remedy);
    setCurrentView('study');
  };

  const startQuiz = () => {
    if (selectedRemedy) {
      const question = getRandomQuestion(selectedRemedy.id);
      setCurrentQuestion(question);
      setCurrentView('quiz');
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestion?.correctAnswer;
    setUserProgress(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      currentScore: Math.round(((prev.correctAnswers + (isCorrect ? 1 : 0)) / (prev.totalQuestions + 1)) * 100),
      streak: isCorrect ? prev.streak + 1 : 0
    }));
  };

  const nextQuestion = () => {
    if (selectedRemedy) {
      const question = getRandomQuestion(selectedRemedy.id);
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const getProgressPercent = () => {
    return (userProgress.completedRemedies.length / REMEDIES_DATABASE.length) * 100;
  };

  const renderOverview = () => (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-4">
          <BookOpen className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Remedy Learning Center
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Master homeopathic remedies through interactive lessons from Boericke's Materia Medica. 
          Study remedy profiles, symptoms, and test your knowledge with adaptive quizzes.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userProgress.completedRemedies.length}</div>
              <div className="text-sm text-gray-600">Remedies Studied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProgress.currentScore}%</div>
              <div className="text-sm text-gray-600">Quiz Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProgress.streak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userProgress.level}</div>
              <div className="text-sm text-gray-600">Difficulty Level</div>
            </div>
          </div>
          <Progress value={getProgressPercent()} className="h-2" />
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
                <div className="flex items-center gap-1">
                  {userProgress.completedRemedies.includes(remedy.id) && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
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
  );

  const renderStudyView = () => {
    if (!selectedRemedy) return null;

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('overview')}
              className="text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
            <Badge className="bg-purple-100 text-purple-800">
              {selectedRemedy.category}
            </Badge>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {selectedRemedy.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 italic">
              {selectedRemedy.fullName}
            </p>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
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
                  <Heart className="h-5 w-5 text-red-500" />
                  Primary Uses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {selectedRemedy.keyUses.map((use, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{use}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Tabs defaultValue="mental" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mental">Mental Symptoms</TabsTrigger>
                <TabsTrigger value="physical">Physical Symptoms</TabsTrigger>
                <TabsTrigger value="modalities">Modalities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mental">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-500" />
                      Mental & Emotional Symptoms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedRemedy.mentalSymptoms.map((symptom, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <span className="text-gray-700 dark:text-gray-300">{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="physical">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-500" />
                      Physical Symptoms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedRemedy.physicalSymptoms.map((symptom, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <span className="text-gray-700 dark:text-gray-300">{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="modalities">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">Worse From</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedRemedy.modalities.worse.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">Better From</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedRemedy.modalities.better.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Dosage Information */}
            <Card>
              <CardHeader>
                <CardTitle>Dosage & Potencies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Common Potencies: </span>
                  <div className="flex gap-2 mt-1">
                    {selectedRemedy.potencies.map((potency, index) => (
                      <Badge key={index} variant="outline">{potency}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Typical Dosage: </span>
                  <span className="text-gray-600 dark:text-gray-400">{selectedRemedy.dosage}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Quiz Button */}
        <div className="p-6 border-t bg-gray-50 dark:bg-gray-900">
          <Button 
            onClick={startQuiz}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3"
            size="lg"
          >
            <Brain className="h-5 w-5 mr-2" />
            Test Your Knowledge
          </Button>
        </div>
      </div>
    );
  };

  const renderQuizView = () => {
    if (!currentQuestion || !selectedRemedy) return null;

    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('study')}
              className="text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Study
            </Button>
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-100 text-purple-800">
                {userProgress.level}
              </Badge>
              <div className="text-sm text-gray-600">
                Score: {userProgress.currentScore}%
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Quiz: {selectedRemedy.name}
          </h1>
        </div>

        {/* Question */}
        <div className="flex-1 p-6 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";
                    
                    if (showResult) {
                      if (index === currentQuestion.correctAnswer) {
                        buttonClass += "border-green-500 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300";
                      } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                        buttonClass += "border-red-500 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300";
                      } else {
                        buttonClass += "border-gray-200 bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
                      }
                    } else {
                      buttonClass += "border-purple-200 hover:border-purple-400 hover:bg-purple-50 hover:text-gray-900 text-gray-800 dark:text-gray-200 dark:hover:bg-purple-900/20 dark:hover:text-gray-100";
                    }

                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        className={buttonClass}
                        onClick={() => !showResult && handleAnswerSelect(index)}
                        disabled={showResult}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {showResult && index === currentQuestion.correctAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Explanation */}
            {showResult && (
              <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
                    <Lightbulb className="h-5 w-5" />
                    Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 dark:text-purple-200">
                    {currentQuestion.explanation}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation */}
        {showResult && (
          <div className="p-6 border-t bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-3 justify-center">
              <Button
                onClick={nextQuestion}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                Next Question
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentView('study')}
              >
                Back to Study
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <div className="h-full flex flex-col">
          {currentView === 'overview' && renderOverview()}
          {currentView === 'study' && renderStudyView()}
          {currentView === 'quiz' && renderQuizView()}
        </div>
      </DialogContent>
    </Dialog>
  );
}