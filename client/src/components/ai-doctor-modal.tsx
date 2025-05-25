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
  CheckCircle2,
  Pill,
  User,
  Info,
  Trash2,
  TrendingUp,
  MapPin,
  X
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface AIDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Remedy {
  name: string;
  potency: string;
  indication: string;
  source: string;
  reasoning: string;
  confidence: number; // Confidence score 0-100
  dosage?: string;
  frequency?: string;
  storageLocation?: string;
  inInventory?: boolean;
}

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  remedies?: Remedy[];
  timestamp: Date;
}

export default function AIDoctorModal({ isOpen, onClose }: AIDoctorModalProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
        content: "Hello! I'm your AI Doctor specializing in homeopathic medicine.\n\nI can analyze your symptoms and recommend specific remedies based on classical homeopathic principles. Describe your symptoms in detail, and I'll suggest the most appropriate homeopathic treatments.\n\nHow are you feeling today?",
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);
  
  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    
    try {
      // Send symptoms to our AI endpoint
      const response = await fetch('/api/ai-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: inputText,
          userInventory: medicines.map(m => `${m.name} ${m.potency}`)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      
      // Check which remedies are in user's inventory and add storage location
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
        remedies: remediesWithInventoryCheck,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error calling AI Doctor:', error);
      
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
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] h-[600px] flex flex-col p-0 rounded-xl overflow-hidden [&>button]:hidden">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slideIn {
            from { transform: translateY(10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .message-animation {
            animation: slideIn 0.3s ease-out forwards;
          }
          .typing-indicator span {
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #a855f7;
            border-radius: 50%;
            margin-right: 3px;
            animation: bounce 1.5s infinite ease-in-out;
          }
          .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
          }
          .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
          }
        `}} />
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Dr. Harmony</h3>
              <p className="text-xs text-purple-100">Homeopathic Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
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
                    <p>
                      Dr. Harmony provides educational information based on classical homeopathic literature including works by Kent, Boericke, Clarke, and other trusted sources.
                    </p>
                    <p className="font-bold">
                      This is not a substitute for professional medical advice, diagnosis, or treatment.
                    </p>
                    <p>
                      Always consult qualified healthcare providers for serious health conditions or before making any medical decisions.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction className="bg-purple-600 hover:bg-purple-700">
                  I Understand
                </AlertDialogAction>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-animation`}
                style={{ 
                  opacity: 0, 
                  animationDelay: `${index * 0.1}s` 
                }}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mr-2 shadow-sm">
                    <span className="text-white text-xs">🌿</span>
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
                      
{message.remedies
                        .sort((a, b) => (b.confidence || 0) - (a.confidence || 0)) // Sort by confidence score
                        .map((remedy, remedyIndex) => {
                          const confidenceColor = 
                            (remedy.confidence || 0) >= 80 ? 'text-green-600' :
                            (remedy.confidence || 0) >= 60 ? 'text-yellow-600' : 'text-orange-600';
                          const confidenceBg = 
                            (remedy.confidence || 0) >= 80 ? 'bg-green-100' :
                            (remedy.confidence || 0) >= 60 ? 'bg-yellow-100' : 'bg-orange-100';
                          
                          return (
                            <div key={remedyIndex} className="bg-purple-50 dark:bg-gray-700 rounded-lg p-3 border border-purple-100 dark:border-purple-700 transition-all duration-200 hover:shadow-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Pill className="h-4 w-4 text-purple-500" />
                                  <span className="font-semibold text-sm text-purple-700 dark:text-purple-300">
                                    {remedy.name} {remedy.potency}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {remedy.confidence && (
                                    <Badge className={`${confidenceBg} ${confidenceColor} hover:opacity-80`}>
                                      <TrendingUp className="h-3 w-3 mr-1" />
                                      {remedy.confidence}% match
                                    </Badge>
                                  )}
                                  {remedy.inInventory && (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      In Your Kit
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
                            </div>
                          );
                        })}
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
              <div className="flex message-animation">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mr-2 shadow-sm">
                  <span className="text-white text-xs">🌿</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl rounded-bl-none px-4 py-3 shadow-sm border border-purple-100 dark:border-purple-800">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
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
              placeholder="Tell Dr. Harmony how you're feeling..."
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
            Describe your symptoms in detail for better remedy suggestions
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}