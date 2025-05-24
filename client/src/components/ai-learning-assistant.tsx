import { useState } from "react";
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
  Target
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

  // Learn functionality
  const handleLearnSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
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

  // Quiz functionality
  const handleStartQuiz = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/learning/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: searchTerm }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuizQuestions(data.questions);
        setIsQuizStarted(true);
        setCurrentQuestionIndex(0);
        setSelectedAnswers([]);
        setShowResults(false);
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
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return "bg-green-100 text-green-800";
      case 'intermediate': return "bg-yellow-100 text-yellow-800";
      case 'advanced': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AI-Enhanced Remedy Learning Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Search Input */}
          <div className="mb-4">
            <Label htmlFor="search" className="text-sm font-medium">
              Search for a remedy or condition to learn about:
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="search"
                placeholder="e.g., Arnica for bruises, fever remedies, digestive issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (activeTab === 'learn' ? handleLearnSearch() : handleStartQuiz())}
              />
              <Button
                onClick={activeTab === 'learn' ? handleLearnSearch : handleStartQuiz}
                disabled={isLoading || !searchTerm.trim()}
                className="shrink-0"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="learn" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learn
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4">
              <TabsContent value="learn" className="mt-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Gathering learning materials...</p>
                    </div>
                  </div>
                ) : learningContent ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-500" />
                          {learningContent.title}
                        </CardTitle>
                        <Badge className={getDifficultyColor(learningContent.difficulty)}>
                          {learningContent.difficulty}
                        </Badge>
                      </div>
                      <CardDescription>
                        Comprehensive guide to understanding this remedy
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Overview
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{learningContent.content}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Key Points to Remember
                        </h3>
                        <ul className="space-y-2">
                          {learningContent.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                              <span className="text-gray-700">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-600" />
                          Practical Examples
                        </h3>
                        <div className="grid gap-3">
                          {learningContent.examples.map((example, index) => (
                            <div key={index} className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-gray-700">{example}</p>
                            </div>
                          ))}
                        </div>
                      </div>
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Preparing your quiz...</p>
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
                ) : (
                  <div className="text-center py-12">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Test your knowledge!</p>
                    <p className="text-sm text-gray-500">
                      Search for a topic to generate a personalized quiz based on your learning.
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