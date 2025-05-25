/**
 * Improved Learning Assistant Component
 * 
 * UI Improvements:
 * - Removed "150 Medicines" text from header
 * - Centered and beautified title with stylish design and animations
 * - Added sticky search bar that hides on scroll down, appears on scroll up
 * - Applied blurry glassy background to search bar
 * - Moved "Showing X medicines" to bottom-right corner
 * - Removed redundant "Start Quiz" button from Learn section
 * - Improved medicine details popup with proper scrolling
 * - Maintained "See More" button at bottom center
 */

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  BookOpen, 
  Award, 
  Star, 
  Pill, 
  Heart, 
  ChevronRight,
  Eye,
  Brain,
  Activity,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronDown,
  Filter
} from "lucide-react";

// Interfaces for medicine data
interface HomeopathicMedicine {
  id: number;
  name: string;
  commonName: string;
  category: string;
  primaryUses: string[];
  keySymptoms: string[];
  mentalSymptoms: string[];
  physicalSymptoms: string[];
  modalities: {
    worse: string[];
    better: string[];
  };
  potency: string;
  dosage: string;
  frequency: string;
  source: string;
  keynotes: string[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  medicineId: number;
}

interface ImprovedLearningAssistantProps {
  medicines: HomeopathicMedicine[];
  quizQuestions: QuizQuestion[];
}

export default function ImprovedLearningAssistant({ 
  medicines, 
  quizQuestions 
}: ImprovedLearningAssistantProps) {
  // State management
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz'>('learn');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<HomeopathicMedicine | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Scroll state for sticky search bar
  const [searchBarVisible, setSearchBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);

  // Get unique categories for filtering
  const categories = Array.from(new Set(['all', ...medicines.map(m => m.category)]));
  
  // Handle scroll events to show/hide search bar
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const currentScrollY = scrollContainerRef.current.scrollTop;
    
    if (currentScrollY > 100) { // Only apply after scrolling down a bit
      if (currentScrollY > lastScrollY + 10) {
        // Scrolling down - hide search bar
        setSearchBarVisible(false);
      } else if (currentScrollY < lastScrollY - 10) {
        // Scrolling up - show search bar
        setSearchBarVisible(true);
      }
    } else {
      // At the top - always show search bar
      setSearchBarVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  };

  // Filter medicines based on search and category
  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = !searchTerm || 
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.primaryUses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase())) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.keySymptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination state for incremental loading
  const [currentPage, setCurrentPage] = useState(1);
  const medicinesPerPage = 10;
  
  // Show medicines based on current page (incremental loading)
  const displayedMedicines = filteredMedicines.slice(0, currentPage * medicinesPerPage);
  const hasMoreMedicines = displayedMedicines.length < filteredMedicines.length;

  // Initialize quiz
  const startQuiz = () => {
    const availableQuestions = quizQuestions.filter(q => 
      filteredMedicines.some(m => m.id === q.medicineId)
    );
    
    const shuffledQuestions = [...availableQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
      
    setActiveQuizQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    
    if (answerIndex === activeQuizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < activeQuizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setQuizCompleted(false);
  };

  // Load more medicines function for pagination
  const loadMoreMedicines = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Reset pagination when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [lastScrollY]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Stylish Header with beautiful gradient - No medicine count display */}
      <div className="relative flex flex-col items-center justify-center py-4 px-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-20"></div>
        
        {/* Centered title with animation */}
        <div className="relative flex items-center justify-center z-10 mb-1">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mr-3 shadow-lg animate-pulse">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center animate-fadeIn">
            Learning Assistant
          </h1>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="flex border-b bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex-1 px-8 py-4 font-medium transition-all duration-300 ${
            activeTab === 'learn'
              ? 'text-purple-600 border-b-2 border-purple-600 bg-gradient-to-b from-white to-purple-50/40 dark:from-gray-800 dark:to-purple-900/20'
              : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/10'
          }`}
        >
          <BookOpen className={`h-5 w-5 inline mr-2 transition-transform duration-300 ${activeTab === 'learn' ? 'scale-110' : ''}`} />
          Learn Remedies
        </button>
        <button
          onClick={() => {
            setActiveTab('quiz');
            if (!quizStarted) startQuiz();
          }}
          className={`flex-1 px-8 py-4 font-medium transition-all duration-300 ${
            activeTab === 'quiz'
              ? 'text-purple-600 border-b-2 border-purple-600 bg-gradient-to-b from-white to-purple-50/40 dark:from-gray-800 dark:to-purple-900/20'
              : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/10'
          }`}
        >
          <Award className={`h-5 w-5 inline mr-2 transition-transform duration-300 ${activeTab === 'quiz' ? 'scale-110' : ''}`} />
          Test Knowledge
        </button>
      </div>

      {/* Learn Tab Content */}
      {activeTab === 'learn' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable content area with event listener */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-auto"
            onScroll={handleScroll}
          >
            {/* Sticky Search Bar with blurry glassy background that shows/hides on scroll */}
            <div 
              className={`sticky top-0 z-10 search-bar-container ${searchBarVisible ? 'search-bar-visible' : 'search-bar-hidden'}`}
            >
              <div className="py-3 px-4 bg-gradient-to-r from-purple-50/95 to-indigo-50/95 dark:from-gray-800/95 dark:to-gray-900/95 border-b backdrop-blur-md shadow-sm">
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-2 items-center">
                    {/* Compact Search Bar */}
                    <div className="w-64 relative flex-grow-0">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Search medicines, uses, or symptoms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-7 py-1 h-8 text-sm bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400 shadow-sm"
                      />
                    </div>
                    
                    {/* Compact Category Filter */}
                    <div className="relative w-48 flex-shrink-0">
                      <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-7 pr-7 py-1 h-8 text-sm border border-purple-200 rounded-md bg-white/80 backdrop-blur-sm focus:border-purple-400 appearance-none shadow-sm"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medicines Grid with Better Container */}
            <div className="p-8">
              <div className="max-w-7xl mx-auto">
                {/* Medicine Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {displayedMedicines.map((medicine) => (
                    <Card
                      key={medicine.id}
                      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 border-purple-100 dark:border-purple-800"
                      onClick={() => setSelectedMedicine(medicine)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-purple-900 dark:text-purple-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                              {medicine.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {medicine.commonName}
                            </p>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 hover:bg-purple-200">
                            {medicine.category}
                          </Badge>
                        </div>

                        <div className="text-sm text-gray-700 dark:text-gray-300 mt-3 space-y-1">
                          <div className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{medicine.primaryUses[0]}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>{medicine.mentalSymptoms[0]}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <div className="text-xs px-2 py-1 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full flex items-center">
                            <ChevronRight className="h-3 w-3 mr-1" />
                            View Details
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Bottom area with information and pagination */}
                <div className="flex flex-wrap justify-between items-center">
                  {/* Empty space for balance - can be used later */}
                  <div className="w-40"></div>
                  
                  {/* Pagination-Style "See More" Button - Bottom Center */}
                  <div className="flex-grow flex justify-center">
                    {hasMoreMedicines && (
                      <Button
                        onClick={loadMoreMedicines}
                        className="premium-pagination-button bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                      >
                        <ChevronDown className="h-4 w-4 mr-2" />
                        See More Medicines
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Medicine count indicator - moved to bottom right */}
                  <div className="w-40 text-right">
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      Showing <span className="font-medium">{displayedMedicines.length}</span> medicines
                    </p>
                  </div>
                </div>

                {/* Empty State */}
                {displayedMedicines.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No medicines found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Tab Content */}
      {activeTab === 'quiz' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {quizStarted && activeQuizQuestions.length > 0 ? (
            <div className="flex-1 flex flex-col p-6">
              {!quizCompleted ? (
                <div className="max-w-3xl mx-auto w-full">
                  {/* Quiz Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Question {currentQuestionIndex + 1} of {activeQuizQuestions.length}
                      </span>
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Score: {score}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Question Card */}
                  <Card className="mb-6 bg-white dark:bg-gray-800 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        {activeQuizQuestions[currentQuestionIndex].question}
                      </h3>
                      
                      <div className="space-y-3">
                        {activeQuizQuestions[currentQuestionIndex].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => !showAnswer && handleAnswerSelect(index)}
                            disabled={showAnswer}
                            className={`w-full text-left p-3 rounded-md border transition-all ${
                              showAnswer
                                ? index === activeQuizQuestions[currentQuestionIndex].correctAnswer
                                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                  : index === selectedAnswer
                                  ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                  : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-purple-700 dark:hover:bg-purple-900/20'
                            }`}
                          >
                            <div className="flex items-center">
                              {showAnswer && (
                                <span className="mr-2">
                                  {index === activeQuizQuestions[currentQuestionIndex].correctAnswer ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : index === selectedAnswer ? (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                  ) : null}
                                </span>
                              )}
                              <span className={`${
                                showAnswer && index === activeQuizQuestions[currentQuestionIndex].correctAnswer
                                  ? 'font-medium text-green-800 dark:text-green-200'
                                  : showAnswer && index === selectedAnswer
                                  ? 'font-medium text-red-800 dark:text-red-200'
                                  : 'text-gray-800 dark:text-gray-200'
                              }`}>
                                {option}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      {showAnswer && (
                        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-800">
                          <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-2">Explanation:</h4>
                          <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            {activeQuizQuestions[currentQuestionIndex].explanation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Quiz Navigation */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={resetQuiz}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restart Quiz
                    </Button>
                    
                    {showAnswer && (
                      <Button
                        onClick={nextQuestion}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                      >
                        {currentQuestionIndex < activeQuizQuestions.length - 1 ? (
                          <>Next Question<ChevronRight className="ml-2 h-4 w-4" /></>
                        ) : (
                          <>Finish Quiz<ChevronRight className="ml-2 h-4 w-4" /></>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto text-center">
                  <div className="w-20 h-20 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                    <Award className="h-10 w-10 text-purple-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Quiz Completed!
                  </h2>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    You scored {score} out of {activeQuizQuestions.length} questions correctly.
                  </p>
                  
                  <div className="mb-8">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-1000 ${
                          score / activeQuizQuestions.length >= 0.7
                            ? 'bg-green-600'
                            : score / activeQuizQuestions.length >= 0.4
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${(score / activeQuizQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('learn')}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Back to Learning
                    </Button>
                    
                    <Button
                      onClick={resetQuiz}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Take Another Quiz
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8 max-w-md">
                <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  Test Your Homeopathic Knowledge
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Challenge yourself with questions about remedies, symptoms, and applications.
                </p>
                
                <Button
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Start Quiz
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Medicine Details Modal with proper scrolling */}
      {selectedMedicine && (
        <Dialog open={!!selectedMedicine} onOpenChange={() => setSelectedMedicine(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-hidden [&>button]:hidden">
            <div className="flex flex-col h-full max-h-[85vh]">
              {/* Medicine Header - More Compact */}
              <div className="py-4 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-xl font-bold mb-1">{selectedMedicine.name}</h2>
                      <p className="text-purple-100 text-sm">{selectedMedicine.commonName}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-white/20 text-white border-white/30 mb-1 text-xs">
                        {selectedMedicine.category}
                      </Badge>
                      <div className="text-xs text-purple-100">
                        {selectedMedicine.potency} • {selectedMedicine.dosage}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    <span className="text-purple-100 text-xs">{selectedMedicine.category}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedMedicine(null)}
                  className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/20 hover:bg-white/30"
                >
                  ×
                </Button>
              </div>

              {/* Medicine Content with Improved Scrolling */}
              <ScrollArea className="flex-1 p-4 overflow-y-auto max-h-[calc(85vh-120px)]">
                <div className="space-y-4">
                  {/* Primary Uses - More Compact */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">Primary Uses</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedMedicine.primaryUses.map((use, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span className="text-green-800 dark:text-green-200 text-sm">{use}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Symptoms - More Compact */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Key Symptoms</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedMedicine.keySymptoms.map((symptom, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                          <span className="text-blue-800 dark:text-blue-200 text-sm">{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mental & Physical Symptoms - More Compact */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Mental Symptoms */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100">Mental & Emotional</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedMedicine.mentalSymptoms.map((symptom, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
                            <span className="text-purple-800 dark:text-purple-200 text-sm">{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Physical Symptoms - More Compact */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-orange-600" />
                        <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100">Physical Symptoms</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedMedicine.physicalSymptoms.map((symptom, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0"></div>
                            <span className="text-orange-800 dark:text-orange-200 text-sm">{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Modalities - More Compact */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Worse From */}
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <h3 className="text-sm font-semibold text-red-900 dark:text-red-100">Worse From</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedMedicine.modalities.worse.map((worse, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                            <span className="text-red-800 dark:text-red-200 text-sm">{worse}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Better From */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">Better From</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedMedicine.modalities.better.map((better, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                            <span className="text-green-800 dark:text-green-200 text-sm">{better}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dosage Information */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-indigo-600" />
                      <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">Dosage Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-indigo-800 dark:text-indigo-200 text-sm">Potency: </span>
                          <span className="text-indigo-700 dark:text-indigo-300 text-sm">{selectedMedicine.potency}</span>
                        </div>
                        <div>
                          <span className="font-medium text-indigo-800 dark:text-indigo-200 text-sm">Dosage: </span>
                          <span className="text-indigo-700 dark:text-indigo-300 text-sm">{selectedMedicine.dosage}</span>
                        </div>
                        <div>
                          <span className="font-medium text-indigo-800 dark:text-indigo-200 text-sm">Frequency: </span>
                          <span className="text-indigo-700 dark:text-indigo-300 text-sm">{selectedMedicine.frequency}</span>
                        </div>
                      </div>
                      
                      {/* Keynotes */}
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-600" />
                          <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Keynotes</h3>
                        </div>
                        <div className="space-y-2">
                          {selectedMedicine.keynotes.map((keynote, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Star className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                              <span className="text-yellow-800 dark:text-yellow-200 text-sm">{keynote}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Source Information */}
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-gray-600" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Source</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{selectedMedicine.source}</p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}