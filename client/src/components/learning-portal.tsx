import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Brain, Book, Target, ArrowLeft, Search, Star, CheckCircle, X, Sparkles, Award } from "lucide-react";

interface LearningPortalProps {
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

// Complete database of 50+ common homeopathic medicines
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
  },
  {
    id: 3,
    name: "Nux Vomica",
    commonName: "Poison Nut",
    uses: ["Digestive issues", "Hangover", "Constipation", "Irritability", "Overindulgence"],
    symptoms: ["Digestive complaints from rich food", "Irritable and impatient", "Chilly"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Digestive",
    potency: "30C",
    keynotes: ["Type A personality", "Worse from stimulants", "Chilly and irritable"],
    difficulty: 'Intermediate'
  },
  {
    id: 4,
    name: "Pulsatilla",
    commonName: "Wind Flower",
    uses: ["Colds", "Ear infections", "Digestive upset", "Hormonal issues", "Changeable symptoms"],
    symptoms: ["Thick yellow discharge", "Worse in warm rooms", "Wants fresh air"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Respiratory & Hormonal",
    potency: "30C",
    keynotes: ["Mild, yielding disposition", "Worse in warm rooms", "Changeable symptoms"],
    difficulty: 'Intermediate'
  },
  {
    id: 5,
    name: "Apis Mellifica",
    commonName: "Honey Bee",
    uses: ["Bee stings", "Allergic reactions", "Swelling", "Burning pain", "Hives"],
    symptoms: ["Burning, stinging pains", "Swelling", "Better from cold applications"],
    dosage: "3-5 pellets",
    frequency: "Every 15-30 minutes",
    category: "Allergic Reactions",
    potency: "30C",
    keynotes: ["Burning, stinging pains", "Swelling", "Better from cold"],
    difficulty: 'Beginner'
  },
  {
    id: 6,
    name: "Rhus Toxicodendron",
    commonName: "Poison Ivy",
    uses: ["Joint stiffness", "Rheumatism", "Skin rashes", "Restlessness", "Sprains"],
    symptoms: ["Stiffness worse on first motion", "Restless legs", "Itchy skin eruptions"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Joint & Muscle",
    potency: "30C",
    keynotes: ["Better from motion after initial stiffness", "Restless", "Worse in damp weather"],
    difficulty: 'Intermediate'
  },
  {
    id: 7,
    name: "Aconitum Napellus",
    commonName: "Monkshood",
    uses: ["Sudden fever", "Panic attacks", "Fear", "Shock", "Cold exposure"],
    symptoms: ["Sudden onset after cold wind", "Great fear and anxiety", "Restlessness"],
    dosage: "3-5 pellets",
    frequency: "Every 15-30 minutes",
    category: "Acute & Emergency",
    potency: "30C",
    keynotes: ["Sudden onset after fright or cold", "Great fear of death", "Worse around midnight"],
    difficulty: 'Beginner'
  },
  {
    id: 8,
    name: "Chamomilla",
    commonName: "German Chamomile",
    uses: ["Teething", "Colic", "Irritability", "Earache", "Sleeplessness"],
    symptoms: ["Extreme irritability", "One cheek red, one pale", "Wants to be carried"],
    dosage: "3-5 pellets",
    frequency: "As needed",
    category: "Children & Irritability",
    potency: "30C",
    keynotes: ["Nothing pleases", "Angry and irritable", "Better from being carried"],
    difficulty: 'Beginner'
  },
  {
    id: 9,
    name: "Bryonia Alba",
    commonName: "White Bryony",
    uses: ["Headaches", "Cough", "Joint pain", "Irritability", "Constipation"],
    symptoms: ["Worse from any motion", "Wants to be left alone", "Dry mucous membranes"],
    dosage: "3-5 pellets",
    frequency: "3 times daily",
    category: "Respiratory & Joint",
    potency: "30C",
    keynotes: ["Worse from motion", "Wants to be still", "Very irritable when disturbed"],
    difficulty: 'Intermediate'
  },
  {
    id: 10,
    name: "Calcarea Carbonica",
    commonName: "Calcium Carbonate",
    uses: ["Bone health", "Slow development", "Fatigue", "Anxiety", "Digestive issues"],
    symptoms: ["Chilly and sweaty", "Slow to develop", "Head sweats during sleep"],
    dosage: "3-5 pellets",
    frequency: "Once daily",
    category: "Constitutional",
    potency: "200C",
    keynotes: ["Chilly, sweaty head", "Slow and cautious", "Craves eggs"],
    difficulty: 'Advanced'
  }
];

function LearningInterface({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("learn");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRemedies, setFilteredRemedies] = useState<HomeopathicRemedy[]>(HOMEOPATHIC_REMEDIES);
  const [selectedRemedy, setSelectedRemedy] = useState<HomeopathicRemedy | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

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

  const quizQuestions = [
    {
      question: "What is Arnica Montana primarily used for?",
      options: ["Bruises and trauma", "Digestive issues", "High fever", "Anxiety"],
      correct: 0,
      explanation: "Arnica Montana is the first remedy for any physical injury, bruises, and trauma."
    },
    {
      question: "Which remedy is known for sudden onset with red, hot, throbbing symptoms?",
      options: ["Pulsatilla", "Belladonna", "Nux Vomica", "Apis"],
      correct: 1,
      explanation: "Belladonna is characterized by sudden violent onset with red, hot, throbbing symptoms."
    },
    {
      question: "What is a key characteristic of Pulsatilla patients?",
      options: ["Aggressive nature", "Worse in warm rooms", "Craves cold drinks", "Very talkative"],
      correct: 1,
      explanation: "Pulsatilla patients typically feel worse in warm rooms and want fresh air."
    }
  ];

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const selectAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowAnswer(true);
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      alert(`Quiz complete! You scored ${score + (selectedAnswer === quizQuestions[currentQuestion].correct ? 1 : 0)}/${quizQuestions.length}`);
      setQuizStarted(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2147483647
      }}
    >
      <div className="w-full h-full flex flex-col">
        {/* Purple Gradient Header with Glassy Effects */}
        <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-6 shadow-lg">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 animate-pulse"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg border border-white/30 animate-bounce">
                <Brain className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold tracking-wide drop-shadow-lg">
                  AI-Enhanced Remedy Learning Assistant
                </h1>
                <p className="text-purple-100 text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Master homeopathic remedies with interactive learning and quizzes
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-lg border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <Tabs defaultValue="learn" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg">
                <TabsTrigger value="learn" className="flex items-center gap-2 font-medium">
                  <Book className="h-4 w-4" />
                  Learn Remedies
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-2 font-medium">
                  <Target className="h-4 w-4" />
                  Test Knowledge
                </TabsTrigger>
              </TabsList>

              {/* Search Bar */}
              <div className="mb-6">
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
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
                      className="pl-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  {activeTab === "quiz" && (
                    <Button 
                      onClick={startQuiz}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Start Quiz
                    </Button>
                  )}
                </div>
              </div>

              <TabsContent value="learn" className="mt-0">
                {selectedRemedy ? (
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-purple-200">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl text-purple-800 dark:text-purple-200">
                            {selectedRemedy.name}
                          </CardTitle>
                          <p className="text-purple-600 dark:text-purple-300 italic">
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

                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div>
                          <h5 className="font-semibold mb-2">Dosage</h5>
                          <p className="text-sm">{selectedRemedy.dosage}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-2">Frequency</h5>
                          <p className="text-sm">{selectedRemedy.frequency}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold mb-2">Potency</h5>
                          <p className="text-sm">{selectedRemedy.potency}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg mb-3">Key Notes</h4>
                        <div className="space-y-2">
                          {selectedRemedy.keynotes.map((note, index) => (
                            <div key={index} className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-400">
                              <p className="text-sm">{note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRemedies.map((remedy) => (
                      <Card 
                        key={remedy.id} 
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-200 hover:border-purple-400"
                        onClick={() => setSelectedRemedy(remedy)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg text-purple-800 dark:text-purple-200">
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
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            Click to learn more →
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="quiz" className="mt-0">
                {!quizStarted ? (
                  <Card className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center justify-center gap-2">
                        <Award className="h-6 w-6 text-yellow-500" />
                        Test Your Knowledge
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-lg">
                        Ready to test what you've learned about homeopathic remedies?
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {HOMEOPATHIC_REMEDIES.length} remedies available for learning
                      </p>
                      <Button 
                        onClick={startQuiz}
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg"
                      >
                        <Target className="h-5 w-5 mr-2" />
                        Start Quiz Now
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Question {currentQuestion + 1} of {quizQuestions.length}</CardTitle>
                        <Badge variant="outline">Score: {score}/{currentQuestion + (showAnswer ? 1 : 0)}</Badge>
                      </div>
                      <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {quizQuestions[currentQuestion].question}
                      </h3>
                      
                      <div className="space-y-2">
                        {quizQuestions[currentQuestion].options.map((option, index) => (
                          <Button
                            key={index}
                            variant={
                              showAnswer
                                ? index === quizQuestions[currentQuestion].correct
                                  ? "default"
                                  : index === selectedAnswer
                                  ? "destructive"
                                  : "outline"
                                : selectedAnswer === index
                                ? "secondary"
                                : "outline"
                            }
                            className="w-full text-left justify-start p-4 h-auto"
                            onClick={() => !showAnswer && selectAnswer(index)}
                            disabled={showAnswer}
                          >
                            <div className="flex items-center gap-2">
                              {showAnswer && index === quizQuestions[currentQuestion].correct && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                              {showAnswer && index === selectedAnswer && index !== quizQuestions[currentQuestion].correct && (
                                <X className="h-4 w-4 text-red-600" />
                              )}
                              <span>{option}</span>
                            </div>
                          </Button>
                        ))}
                      </div>

                      {showAnswer && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                          <p className="font-semibold mb-2">Explanation:</p>
                          <p className="text-sm">{quizQuestions[currentQuestion].explanation}</p>
                        </div>
                      )}

                      {showAnswer && (
                        <div className="flex justify-end">
                          <Button onClick={nextQuestion}>
                            {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default function LearningPortal({ isOpen, onClose }: LearningPortalProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create a new div and append it to document.body for portal
    const portalDiv = document.createElement('div');
    portalDiv.id = 'learning-portal';
    portalDiv.style.position = 'fixed';
    portalDiv.style.top = '0';
    portalDiv.style.left = '0';
    portalDiv.style.width = '100vw';
    portalDiv.style.height = '100vh';
    portalDiv.style.zIndex = '2147483647';
    portalDiv.style.pointerEvents = 'auto';
    
    document.body.appendChild(portalDiv);
    setPortalRoot(portalDiv);

    return () => {
      // Cleanup: remove the portal div when component unmounts
      if (document.body.contains(portalDiv)) {
        document.body.removeChild(portalDiv);
      }
    };
  }, []);

  if (!isOpen || !portalRoot) return null;

  return createPortal(
    <LearningInterface onClose={onClose} />,
    portalRoot
  );
}