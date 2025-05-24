import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Loader2, 
  BookOpen, 
  AlertTriangle,
  Pill,
  User,
  Info,
  Trash2,
  TrendingUp,
  MapPin,
  BarChart3,
  RefreshCw,
  Archive
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Remedy {
  name: string;
  potency: string;
  indication: string;
  source: string;
  reasoning: string;
  confidence: number;
  dosage?: string;
  frequency?: string;
  storageLocation?: string;
  inInventory?: boolean;
  alternativeTo?: string;
  usageCount?: number;
}

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  messageType?: 'symptom' | 'trend' | 'substitution' | 'dosage' | 'general';
  remedies?: Remedy[];
  trends?: any[];
  timestamp: Date;
}

export default function AIHomeopathyChatbot({ isOpen, onClose }: AIChatbotProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'general' | 'symptom' | 'trend' | 'substitution' | 'dosage'>('general');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Get user's medicine inventory
  const medicines = useStore((state) => state.medicines);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        type: 'ai',
        content: "Welcome to HomeoInvent AI Helper!\n\nI can assist you with:\n• Usage trends - Ask 'show my trends'\n• Remedy substitutions - Ask 'alternatives for [remedy]'\n• Dosage adjustments - Ask 'dosage for [condition]'\n\nFor symptom-based remedy recommendations, please use the AI Doctor button. How can I help you today?",
        messageType: 'general',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  // Detect message type and route accordingly
  const detectMessageType = (message: string): 'symptom' | 'trend' | 'substitution' | 'dosage' | 'general' => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('trend') || lowerMessage.includes('usage') || lowerMessage.includes('used') || lowerMessage.includes('statistics')) {
      return 'trend';
    }
    if (lowerMessage.includes('alternative') || lowerMessage.includes('substitute') || lowerMessage.includes('replacement') || lowerMessage.includes('instead of')) {
      return 'substitution';
    }
    if (lowerMessage.includes('dosage') || lowerMessage.includes('dose') || lowerMessage.includes('how much') || lowerMessage.includes('how many')) {
      return 'dosage';
    }
    if (lowerMessage.includes('symptom') || lowerMessage.includes('feel') || lowerMessage.includes('pain') || lowerMessage.includes('ache') || lowerMessage.includes('sick')) {
      return 'symptom';
    }
    
    return 'general';
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const messageType = detectMessageType(inputText);
    
    const userMessage: ChatMessage = {
      type: 'user',
      content: inputText,
      messageType,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);
    
    try {
      let response;
      
      // Route to appropriate endpoint based on message type
      switch (messageType) {
        case 'trend':
          response = await fetch('/api/homeopathy-trends', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: currentInput,
              userInventory: medicines.map(m => `${m.name} ${m.potency}`)
            }),
          });
          break;
          
        case 'substitution':
          response = await fetch('/api/remedy-substitutions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: currentInput,
              userInventory: medicines.map(m => `${m.name} ${m.potency}`)
            }),
          });
          break;
          
        case 'dosage':
          response = await fetch('/api/dosage-recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: currentInput,
              userInventory: medicines.map(m => `${m.name} ${m.potency}`)
            }),
          });
          break;
          
        default:
          // Symptom matching or general AI doctor
          response = await fetch('/api/ai-doctor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              symptoms: currentInput,
              userInventory: medicines.map(m => `${m.name} ${m.potency}`)
            }),
          });
      }
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      
      // Process remedies with inventory check
      const remediesWithInventoryCheck = data.remedies?.map((remedy: Remedy) => {
        const matchingMedicine = medicines.find(m => 
          m.name.toLowerCase().includes(remedy.name.toLowerCase()) ||
          remedy.name.toLowerCase().includes(m.name.toLowerCase())
        );
        
        return {
          ...remedy,
          inInventory: !!matchingMedicine,
          storageLocation: matchingMedicine ? `${matchingMedicine.location}${matchingMedicine.subLocation ? ` - ${matchingMedicine.subLocation}` : ''}` : undefined
        };
      }) || [];

      const aiMessage: ChatMessage = {
        type: 'ai',
        content: data.response,
        messageType,
        remedies: remediesWithInventoryCheck,
        trends: data.trends,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error calling AI Chatbot:', error);
      
      const errorMessage: ChatMessage = {
        type: 'ai',
        content: "I apologize, but I'm currently unable to process your request. This could be due to a connection issue. Please try again in a moment, or consult with a qualified homeopathic practitioner for personalized advice.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      type: 'ai',
      content: "Chat cleared. How can I help you with homeopathic remedies today?",
      timestamp: new Date()
    }]);
  };

  const quickActions = [
    { label: "Find alternatives", icon: RefreshCw, action: () => setInputText("Find alternatives for ") },
    { label: "Dosage advice", icon: Archive, action: () => setInputText("What dosage for ") },
    { label: "General guidance", icon: BookOpen, action: () => setInputText("I need help with homeopathic remedies") }
  ];

  const renderRemedyCard = (remedy: Remedy, index: number) => {
    const confidenceColor = 
      remedy.confidence >= 80 ? 'text-green-600' :
      remedy.confidence >= 60 ? 'text-yellow-600' : 'text-orange-600';
    const confidenceBg = 
      remedy.confidence >= 80 ? 'bg-green-100' :
      remedy.confidence >= 60 ? 'bg-yellow-100' : 'bg-orange-100';

    return (
      <Card key={index} className="bg-purple-50 dark:bg-gray-700 border border-purple-100 dark:border-purple-700 transition-all duration-200 hover:shadow-md">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-purple-500" />
              <span className="font-semibold text-sm text-purple-700 dark:text-purple-300">
                {remedy.name} {remedy.potency}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${confidenceBg} ${confidenceColor} hover:opacity-80`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {remedy.confidence}% match
              </Badge>
              {remedy.inInventory && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">
                  ✓ In Stock
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-2 text-xs">
            <p>
              <span className="text-purple-600 dark:text-purple-400 font-medium">For: </span>
              <span className="text-gray-700 dark:text-gray-300">{remedy.indication}</span>
            </p>
            
            {remedy.dosage && (
              <p>
                <span className="text-purple-600 dark:text-purple-400 font-medium">Dosage: </span>
                <span className="text-gray-700 dark:text-gray-300">{remedy.dosage}</span>
              </p>
            )}
            
            {remedy.frequency && (
              <p>
                <span className="text-purple-600 dark:text-purple-400 font-medium">Frequency: </span>
                <span className="text-gray-700 dark:text-gray-300">{remedy.frequency}</span>
              </p>
            )}
            
            {remedy.storageLocation && (
              <p>
                <span className="text-purple-600 dark:text-purple-400 font-medium">Location: </span>
                <span className="text-green-700 dark:text-green-300 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {remedy.storageLocation}
                </span>
              </p>
            )}
            
            {remedy.alternativeTo && (
              <p>
                <span className="text-purple-600 dark:text-purple-400 font-medium">Alternative to: </span>
                <span className="text-blue-700 dark:text-blue-300">{remedy.alternativeTo}</span>
              </p>
            )}
            
            <p>
              <span className="text-purple-600 dark:text-purple-400 font-medium">Why: </span>
              <span className="text-gray-700 dark:text-gray-300">{remedy.reasoning}</span>
            </p>
            
            <p>
              <span className="text-purple-600 dark:text-purple-400 font-medium">Source: </span>
              <span className="text-purple-700 dark:text-purple-300">{remedy.source}</span>
            </p>
            
            {!remedy.inInventory && (
              <p className="text-orange-600 dark:text-orange-400 text-xs italic mt-2">
                Not in inventory - Consider adding to your collection
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] h-[700px] flex flex-col p-0 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Homeopathy Chatbot</h3>
              <p className="text-xs text-purple-100">Your Comprehensive Remedy Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Info className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Medical Disclaimer
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2 text-left">
                    <p>This AI assistant provides educational information based on classical homeopathic literature.</p>
                    <p className="font-bold">This is not a substitute for professional medical advice, diagnosis, or treatment.</p>
                    <p>Always consult qualified healthcare providers for serious health conditions.</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction className="bg-purple-600 hover:bg-purple-700">
                  I Understand
                </AlertDialogAction>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="ghost" size="sm" onClick={clearChat} className="text-white hover:bg-white/20">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions Buttons */}
        <div className="p-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b">
          <div className="flex items-center gap-1.5 justify-between">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action.action}
                className="h-8 px-2 justify-center flex-1 bg-white hover:bg-white/90 border border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-purple-300"
              >
                <action.icon className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mr-2 shadow-sm">
                    <span className="text-white text-xs">🤖</span>
                  </div>
                )}
                
                <div 
                  className={`max-w-[80%] rounded-xl px-4 py-3 shadow-sm ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-purple-100 dark:border-purple-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Remedy Suggestions */}
                  {message.remedies && message.remedies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-medium text-sm">Recommended Remedies</span>
                      </div>
                      
                      <div className="space-y-2">
                        {message.remedies
                          .sort((a, b) => {
                            if (a.inInventory && !b.inInventory) return -1;
                            if (!a.inInventory && b.inInventory) return 1;
                            return (b.confidence || 0) - (a.confidence || 0);
                          })
                          .map((remedy, remedyIndex) => renderRemedyCard(remedy, remedyIndex))
                        }
                      </div>
                    </div>
                  )}

                  {/* Usage Trends */}
                  {message.trends && message.trends.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <BarChart3 className="h-4 w-4" />
                        <span className="font-medium text-sm">Usage Insights</span>
                      </div>
                      
                      <div className="space-y-2">
                        {message.trends.map((trend: any, trendIndex: number) => (
                          <Card key={trendIndex} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                            <CardContent className="p-3">
                              <p className="text-sm text-blue-800 dark:text-blue-300">{trend.insight}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs opacity-60 mt-2 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center flex-shrink-0 ml-2 shadow-sm">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mr-2 shadow-sm">
                  <span className="text-white text-xs">🤖</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl rounded-bl-none px-4 py-3 shadow-sm border border-purple-100 dark:border-purple-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-purple-100 dark:border-purple-800">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about symptoms, trends, alternatives, or dosages..."
              disabled={isLoading}
              className="rounded-full border-purple-200 dark:border-purple-700 focus:border-purple-400"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              size="icon"
              className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-center mt-2 text-purple-500 dark:text-purple-400">
            Try: "I have a fever" • "Show my trends" • "Alternatives for Arnica"
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}