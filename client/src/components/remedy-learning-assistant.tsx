import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Trophy,
  Star,
  Brain,
  Target,
  Zap,
  Award
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LearningAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  remedy: string;
  category: string;
  source: string;
}

interface QuizResult {
  questionId: number;
  correct: boolean;
  timeSpent: number;
  selectedAnswer: number;
  timestamp: Date;
}

interface LearningStats {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  level: string;
  experiencePoints: number;
  strongTopics: string[];
  weakTopics: string[];
}

export default function RemedyLearningAssistant({ isOpen, onClose }: LearningAssistantProps) {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [learningStats, setLearningStats] = useState<LearningStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    level: 'Beginner',
    experiencePoints: 0,
    strongTopics: [],
    weakTopics: []
  });
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  
  // Get user's medicine inventory for personalized questions
  const medicines = useStore((state) => state.medicines);

  // Load saved learning progress
  useEffect(() => {
    if (isOpen) {
      loadLearningProgress();
      generateNewQuestion();
    }
  }, [isOpen]);

  const loadLearningProgress = () => {
    const savedStats = localStorage.getItem('homeo-learning-stats');
    const savedResults = localStorage.getItem('homeo-quiz-results');
    
    if (savedStats) {
      setLearningStats(JSON.parse(savedStats));
    }
    if (savedResults) {
      setQuizResults(JSON.parse(savedResults));
    }
  };

  const saveLearningProgress = (newStats: LearningStats, newResults: QuizResult[]) => {
    localStorage.setItem('homeo-learning-stats', JSON.stringify(newStats));
    localStorage.setItem('homeo-quiz-results', JSON.stringify(newResults));
  };

  const generateNewQuestion = async () => {
    setIsLoading(true);
    setShowResult(false);
    setSelectedAnswer(null);
    setQuestionStartTime(new Date());

    try {
      // Request adaptive question based on user's performance and inventory
      const response = await fetch('/api/generate-quiz-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInventory: medicines.map(m => `${m.name} ${m.potency}`),
          learningStats: learningStats,
          recentResults: quizResults.slice(-10) // Last 10 results for adaptation
          // Firebase integration placeholder:
          // FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY_HERE
          // AI_API_KEY=YOUR_AI_API_KEY_HERE (for dynamic question generation)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate question');
      }

      const data = await response.json();
      setCurrentQuestion(data.question);
      
    } catch (error) {
      console.error('Error generating question:', error);
      
      // Fallback to local question bank
      const fallbackQuestion = generateFallbackQuestion();
      setCurrentQuestion(fallbackQuestion);
      
      toast({
        title: "Using Offline Mode",
        description: "Generating questions from local database.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackQuestion = (): QuizQuestion => {
    const questionBank: QuizQuestion[] = [
      {
        id: 1,
        question: "What is Arnica montana primarily used for?",
        options: ["Digestive issues", "Trauma and bruises", "Respiratory problems", "Skin conditions"],
        correctAnswer: 1,
        explanation: "Arnica montana is the go-to remedy for trauma, bruises, sprains, and physical injuries. It helps reduce swelling and promotes healing.",
        difficulty: 'beginner',
        remedy: 'Arnica',
        category: 'Trauma',
        source: "Boericke's Materia Medica"
      },
      {
        id: 2,
        question: "Which remedy is known as the 'fever remedy' for sudden onset symptoms?",
        options: ["Pulsatilla", "Aconite", "Sulphur", "Bryonia"],
        correctAnswer: 1,
        explanation: "Aconite is used for sudden onset symptoms, especially after exposure to cold wind or shock. It's excellent for the very beginning stages of illness.",
        difficulty: 'beginner',
        remedy: 'Aconite',
        category: 'Acute',
        source: "Boericke's Materia Medica"
      },
      {
        id: 3,
        question: "What modality is characteristic of Bryonia patients?",
        options: ["Better from motion", "Worse from motion", "Better in warm rooms", "Desires company"],
        correctAnswer: 1,
        explanation: "Bryonia patients are characteristically worse from any motion and better from rest and pressure. They want to be left alone when sick.",
        difficulty: 'intermediate',
        remedy: 'Bryonia',
        category: 'Constitutional',
        source: "Boericke's Materia Medica"
      },
      {
        id: 4,
        question: "Which remedy is indicated for 'changeable symptoms' and emotional sensitivity?",
        options: ["Nux vomica", "Pulsatilla", "Arsenicum", "Lycopodium"],
        correctAnswer: 1,
        explanation: "Pulsatilla is known for changeable symptoms, mild disposition, and emotional sensitivity. Patients desire sympathy and feel better in open air.",
        difficulty: 'intermediate',
        remedy: 'Pulsatilla',
        category: 'Constitutional',
        source: "Boericke's Materia Medica"
      },
      {
        id: 5,
        question: "What is the keynote symptom of Hepar sulph?",
        options: ["Burning pains", "Splinter-like pains", "Throbbing pains", "Cramping pains"],
        correctAnswer: 1,
        explanation: "Hepar sulph is characterized by splinter-like pains and extreme sensitivity to cold and touch. It's excellent for suppurative conditions.",
        difficulty: 'advanced',
        remedy: 'Hepar sulph',
        category: 'Suppuration',
        source: "Boericke's Materia Medica"
      }
    ];

    // Adapt difficulty based on user's performance
    const targetDifficulty = learningStats.correctAnswers / Math.max(learningStats.totalQuestions, 1) > 0.8 ? 
      'advanced' : learningStats.totalQuestions < 5 ? 'beginner' : 'intermediate';
    
    const filteredQuestions = questionBank.filter(q => q.difficulty === targetDifficulty);
    const availableQuestions = filteredQuestions.length > 0 ? filteredQuestions : questionBank;
    
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  };

  const submitAnswer = (answerIndex: number) => {
    if (!currentQuestion || selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const timeSpent = new Date().getTime() - questionStartTime.getTime();
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    const result: QuizResult = {
      questionId: currentQuestion.id,
      correct: isCorrect,
      timeSpent,
      selectedAnswer: answerIndex,
      timestamp: new Date()
    };
    
    const newResults = [...quizResults, result];
    setQuizResults(newResults);
    
    // Update learning statistics
    const newStats: LearningStats = {
      ...learningStats,
      totalQuestions: learningStats.totalQuestions + 1,
      correctAnswers: learningStats.correctAnswers + (isCorrect ? 1 : 0),
      streak: isCorrect ? learningStats.streak + 1 : 0,
      experiencePoints: learningStats.experiencePoints + (isCorrect ? 10 : 5),
      level: calculateLevel(learningStats.experiencePoints + (isCorrect ? 10 : 5)),
    };
    
    // Update strong/weak topics based on performance
    updateTopicStrengths(newStats, currentQuestion.category, isCorrect);
    
    setLearningStats(newStats);
    saveLearningProgress(newStats, newResults);
    
    // Show encouraging feedback
    setTimeout(() => {
      if (isCorrect) {
        toast({
          title: "🎉 Correct!",
          description: `Great job! You earned ${isCorrect ? 10 : 5} XP. Streak: ${newStats.streak}`,
        });
      } else {
        toast({
          title: "Keep Learning!",
          description: "Every question helps you grow. Review the explanation and try again!",
          variant: "destructive"
        });
      }
    }, 500);
  };

  const updateTopicStrengths = (stats: LearningStats, category: string, isCorrect: boolean) => {
    // Simple algorithm to track topic performance
    const categoryResults = quizResults.filter(r => 
      r.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    );
    
    const categorySuccess = categoryResults.filter(r => r.correct).length / Math.max(categoryResults.length, 1);
    
    if (categorySuccess > 0.8) {
      if (!stats.strongTopics.includes(category)) {
        stats.strongTopics.push(category);
      }
      stats.weakTopics = stats.weakTopics.filter(t => t !== category);
    } else if (categorySuccess < 0.5) {
      if (!stats.weakTopics.includes(category)) {
        stats.weakTopics.push(category);
      }
      stats.strongTopics = stats.strongTopics.filter(t => t !== category);
    }
  };

  const calculateLevel = (xp: number): string => {
    if (xp < 50) return 'Novice';
    if (xp < 150) return 'Student';
    if (xp < 300) return 'Practitioner';
    if (xp < 500) return 'Expert';
    return 'Master';
  };

  const getAccuracy = () => {
    return learningStats.totalQuestions > 0 ? 
      Math.round((learningStats.correctAnswers / learningStats.totalQuestions) * 100) : 0;
  };

  const getLevelProgress = () => {
    const levelThresholds = { 'Novice': 50, 'Student': 150, 'Practitioner': 300, 'Expert': 500, 'Master': 1000 };
    const currentThreshold = levelThresholds[learningStats.level as keyof typeof levelThresholds] || 1000;
    const previousThreshold = Object.values(levelThresholds)[Object.keys(levelThresholds).indexOf(learningStats.level) - 1] || 0;
    
    return ((learningStats.experiencePoints - previousThreshold) / (currentThreshold - previousThreshold)) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-xl">🧠</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Remedy Learning Assistant</h3>
              <p className="text-xs text-purple-100">Master Homeopathic Knowledge</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white">
              <Trophy className="h-3 w-3 mr-1" />
              {learningStats.level}
            </Badge>
            <Badge className="bg-white/20 text-white">
              <Star className="h-3 w-3 mr-1" />
              {learningStats.experiencePoints} XP
            </Badge>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">{getAccuracy()}%</p>
              <p className="text-xs text-gray-600">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">{learningStats.streak}</p>
              <p className="text-xs text-gray-600">Current Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{learningStats.totalQuestions}</p>
              <p className="text-xs text-gray-600">Questions Answered</p>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Level Progress</span>
              <span>{Math.round(getLevelProgress())}%</span>
            </div>
            <Progress value={getLevelProgress()} className="h-2" />
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 p-6 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <RefreshCw className="h-8 w-8 text-purple-500 animate-spin mb-4" />
              <p className="text-gray-600">Generating your next question...</p>
            </div>
          ) : currentQuestion ? (
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-gray-800 dark:text-gray-200">
                    {currentQuestion.question}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {currentQuestion.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentQuestion.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    let buttonClass = "w-full p-3 text-left border-2 rounded-lg transition-all duration-200 ";
                    
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
                        variant="outline"
                        className={buttonClass}
                        onClick={() => submitAnswer(index)}
                        disabled={showResult}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm font-medium flex items-center justify-center">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                          {showResult && index === currentQuestion.correctAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                          )}
                          {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                            <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showResult && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">Explanation:</p>
                        <p className="text-sm text-blue-700 dark:text-blue-400">{currentQuestion.explanation}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                          Source: {currentQuestion.source}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Brain className="h-12 w-12 text-purple-400 mb-4" />
              <p className="text-gray-600 text-center">Ready to test your homeopathic knowledge?</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-purple-100 dark:border-purple-800">
          {showResult ? (
            <Button
              onClick={generateNewQuestion}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Next Question
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onClose()}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={generateNewQuestion}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Question
              </Button>
            </div>
          )}
          
          <div className="flex justify-center mt-3">
            <p className="text-xs text-gray-500">
              {learningStats.strongTopics.length > 0 && (
                <span className="text-green-600">Strong: {learningStats.strongTopics.join(', ')} </span>
              )}
              {learningStats.weakTopics.length > 0 && (
                <span className="text-orange-600">Focus: {learningStats.weakTopics.join(', ')}</span>
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}