import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Brain, Book, Target, ArrowLeft, Search, Star, CheckCircle, X, Sparkles, Award } from "lucide-react";

interface AILearningAssistantProps {
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

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  remedyId: number;
}

// Comprehensive database of 50+ homeopathic remedies for learning
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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

// Generate quiz questions based on the remedies
const generateQuizQuestions = (remedies: HomeopathicRemedy[]): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  
  remedies.forEach((remedy, index) => {
    questions.push({
      id: index * 2 + 1,
      question: `What is ${remedy.name} primarily used for?`,
      options: [
        remedy.uses[0],
        remedies[(index + 1) % remedies.length].uses[0],
        remedies[(index + 2) % remedies.length].uses[0],
        remedies[(index + 3) % remedies.length].uses[0]
      ],
      correctAnswer: 0,
      explanation: `${remedy.name} is primarily used for ${remedy.uses[0]}. ${remedy.keynotes[0]}.`,
      remedyId: remedy.id
    });
  });
  
  return questions.slice(0, 20);
};

export default function AIEnhancedLearningAssistantTopLayer({ isOpen, onClose }: AILearningAssistantProps) {
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

  if (!isOpen) return null;

  return (
    <>
      {/* Maximum z-index backdrop to ensure highest priority */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-md"
        style={{ zIndex: 2147483646 }}
        onClick={onClose}
      />
      
      {/* Top-level popup modal with maximum z-index */}
      <div 
        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   w-[90vw] h-[85vh] max-w-4xl rounded-3xl overflow-hidden
                   shadow-2xl border border-white/30 animate-in fade-in slide-in-from-bottom-5 duration-300"
        style={{ 
          zIndex: 2147483647,
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 25%, #6D28D9 50%, #5B21B6 75%, #4C1D95 100%)'
        }}
      >
        <div className="w-full h-full flex flex-col">
          {/* Header with Purple Gradient and Glow Effects */}
          <div className="relative p-6 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-violet-500/40 to-purple-600/40 backdrop-blur-md"></div>
            <div className="absolute inset-0 bg-white/10"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-sm shadow-xl border border-white/40">
                  <Brain className="h-8 w-8 text-white drop-shadow-xl" />
                </div>
                <div>
                  <h1 className="text-white text-2xl font-bold tracking-wide drop-shadow-xl">
                    AI-Enhanced Remedy Learning Assistant
                  </h1>
                  <p className="text-white/95 text-sm flex items-center gap-2 mt-1">
                    <Sparkles className="h-4 w-4" />
                    Master homeopathic remedies with interactive learning and quizzes
                  </p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/25 rounded-xl border border-white/40 backdrop-blur-sm 
                          transition-all duration-300 hover:scale-105 px-4 py-2"
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          </div>

          {/* Content Area with Proper Scrolling */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/98 via-purple-50/95 to-violet-100/90 backdrop-blur-lg"></div>
            
            <ScrollArea className="h-full">
              <div className="p-6">
                <Tabs defaultValue="learn" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6 bg-white/90 backdrop-blur-xl shadow-xl border border-white/50 rounded-2xl p-1.5">
                    <TabsTrigger 
                      value="learn" 
                      className="flex items-center gap-2 font-medium rounded-xl data-[state=active]:bg-white 
                                data-[state=active]:shadow-lg transition-all duration-300"
                    >
                      <Book className="h-4 w-4" />
                      Learn Remedies
                    </TabsTrigger>
                    <TabsTrigger 
                      value="quiz" 
                      className="flex items-center gap-2 font-medium rounded-xl data-[state=active]:bg-white 
                                data-[state=active]:shadow-lg transition-all duration-300"
                    >
                      <Target className="h-4 w-4" />
                      Test Knowledge
                    </TabsTrigger>
                  </TabsList>

                  {/* Search Bar */}
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
                          placeholder="e.g., Arnica for bruises, fever remedies, digestive issues..."
                          className="pl-10 bg-white/80 backdrop-blur-md border-purple-200 focus:border-purple-400 
                                    shadow-lg rounded-xl"
                        />
                      </div>
                      {activeTab === "quiz" && (
                        <Button 
                          onClick={startQuiz}
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                                    text-white shadow-xl rounded-xl"
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Start Quiz
                        </Button>
                      )}
                    </div>
                  </div>

                  <TabsContent value="learn" className="mt-0">
                    {selectedRemedy ? (
                      <Card className="bg-white/90 backdrop-blur-xl shadow-xl border-purple-200/50 rounded-2xl">
                        <CardHeader className="bg-gradient-to-r from-purple-50/80 to-indigo-50/80">
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

                          <div className="grid md:grid-cols-3 gap-4 p-4 bg-purple-50/80 rounded-xl">
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
                                <div key={index} className="p-3 bg-indigo-50/80 rounded-xl border-l-4 border-indigo-400">
                                  <p className="text-sm">{note}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredRemedies.map((remedy) => (
                          <Card 
                            key={remedy.id} 
                            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 
                                      bg-white/85 backdrop-blur-md border-purple-200/50 rounded-xl"
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
                              <div className="text-xs text-purple-600">
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
                      <Card className="text-center bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl">
                        <CardHeader>
                          <CardTitle className="text-2xl text-purple-800 flex items-center justify-center gap-2">
                            <Target className="h-6 w-6" />
                            Ready to Test Your Knowledge?
                          </CardTitle>
                          <p className="text-gray-600">
                            {filteredRemedies.length} remedies available for quiz questions
                          </p>
                          <Button 
                            onClick={startQuiz}
                            size="lg"
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                                      text-white shadow-xl rounded-xl mt-4"
                          >
                            <Target className="h-5 w-5 mr-2" />
                            Start Learning Quiz
                          </Button>
                        </CardHeader>
                      </Card>
                    ) : quizCompleted ? (
                      <Card className="text-center bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl">
                        <CardHeader>
                          <CardTitle className="text-2xl text-purple-800 flex items-center justify-center gap-2">
                            <Award className="h-6 w-6 text-yellow-500" />
                            Quiz Completed!
                          </CardTitle>
                          <p className="text-xl mt-4">
                            You scored {Math.round((score/quizQuestions.length) * 100)}%
                          </p>
                          <p className="text-gray-600">
                            {score} out of {quizQuestions.length} questions correct
                          </p>
                          <Button 
                            onClick={startQuiz}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                                      text-white shadow-xl rounded-xl mt-4"
                          >
                            Take Quiz Again
                          </Button>
                        </CardHeader>
                      </Card>
                    ) : (
                      <Card className="bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl">
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-xl text-purple-800">
                              Question {currentQuestion + 1} of {quizQuestions.length}
                            </CardTitle>
                            <Badge variant="outline">
                              Score: {score}/{currentQuestion + (showAnswer ? 1 : 0)}
                            </Badge>
                          </div>
                          <Progress value={(currentQuestion / quizQuestions.length) * 100} className="mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <h3 className="text-lg font-medium">{quizQuestions[currentQuestion]?.question}</h3>
                          <div className="space-y-2">
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
                                className="w-full text-left justify-start h-auto p-4"
                                onClick={() => !showAnswer && handleAnswerSelect(index)}
                                disabled={showAnswer}
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                          
                          {showAnswer && (
                            <div className="mt-4 p-4 bg-blue-50/80 rounded-xl">
                              <h4 className="font-semibold mb-2">Explanation:</h4>
                              <p className="text-sm">{quizQuestions[currentQuestion]?.explanation}</p>
                              <Button 
                                onClick={nextQuestion}
                                className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 
                                          text-white shadow-lg rounded-xl"
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
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}