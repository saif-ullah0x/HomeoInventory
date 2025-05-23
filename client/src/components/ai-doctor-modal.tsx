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
  Stethoscope, 
  Send, 
  Loader2, 
  Bot, 
  BookOpen, 
  AlertTriangle,
  CheckCircle2,
  Pill,
  User,
  Info,
  MoreVertical,
  Trash2
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
        content: "Hello! I'm Dr. Harmony, your homeopathic assistant! 🌿\n\nI can help you find natural remedies based on classical homeopathic literature. Just tell me how you're feeling and I'll suggest appropriate medicines.\n\nYou're taking a wonderful step towards natural healing! 💜",
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
      
      // Check which remedies are in user's inventory
      const remediesWithInventoryCheck = data.remedies?.map((remedy: Remedy) => ({
        ...remedy,
        inInventory: medicines.some(m => 
          m.name.toLowerCase().includes(remedy.name.toLowerCase()) ||
          remedy.name.toLowerCase().includes(m.name.toLowerCase())
        )
      })) || [];
      
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
      <DialogContent className="sm:max-w-[400px] max-h-[90vh] h-[600px] flex flex-col p-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
        <DialogHeader className="sr-only">
          <DialogTitle>Dr. Harmony - Homeopathic Assistant</DialogTitle>
          <DialogDescription>Get natural remedy suggestions based on classical homeopathic literature</DialogDescription>
        </DialogHeader>
        
        {/* Header - Purple Theme */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            {/* Cute Doctor Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🌿</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-white">Dr. Harmony</h3>
              <p className="text-xs text-purple-100">Online • Homeopathic Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Info className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-gray-900">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Important Medical Information
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-left space-y-3">
                    <p className="flex items-start gap-2">
                      <span className="text-2xl">📚</span>
                      <span>Dr. Harmony provides <strong>educational information</strong> based on classical homeopathic literature including works by Kent, Boericke, Clarke, and other trusted sources.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-2xl">⚠️</span>
                      <span><strong>Important:</strong> This is <strong>not a substitute</strong> for professional medical advice, diagnosis, or treatment.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-2xl">👩‍⚕️</span>
                      <span>Always consult qualified healthcare providers for serious health conditions or before making any medical decisions.</span>
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction className="bg-purple-600 hover:bg-purple-700">I Understand</AlertDialogAction>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              disabled={isLoading}
              className="text-white hover:bg-white/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Chat Messages - WhatsApp Style */}
        <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-transparent to-white/50 dark:to-black/20" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-sm">🌿</span>
                  </div>
                )}
                
                <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-br-sm' 
                    : 'bg-white dark:bg-gray-800 rounded-bl-sm border border-purple-100 dark:border-purple-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  
                  {/* Remedy Suggestions */}
                  {message.remedies && message.remedies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-medium text-sm">Recommended Remedies</span>
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-full">
                          {message.remedies.length} found
                        </span>
                      </div>
                      {message.remedies.map((remedy, remedyIndex) => (
                        <div key={remedyIndex} className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-xl p-3 border border-purple-200 dark:border-purple-700">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                <Pill className="h-3 w-3 text-white" />
                              </div>
                              <span className="font-semibold text-sm text-purple-700 dark:text-purple-300">
                                {remedy.name} {remedy.potency}
                              </span>
                              {remedy.inInventory && (
                                <Badge className="text-xs bg-purple-500 hover:bg-purple-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  In Your Kit
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-xs">
                            <p className="flex items-start gap-2">
                              <span className="text-purple-600 font-medium">For:</span>
                              <span className="text-gray-700 dark:text-gray-300">{remedy.indication}</span>
                            </p>
                            
                            <p className="flex items-start gap-2">
                              <span className="text-indigo-600 font-medium">Why:</span>
                              <span className="text-gray-700 dark:text-gray-300">{remedy.reasoning}</span>
                            </p>
                            
                            <p className="flex items-start gap-2">
                              <span className="text-purple-600 font-medium">Source:</span>
                              <span className="text-purple-700 dark:text-purple-300 font-medium">{remedy.source}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-60 mt-2 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 animate-in slide-in-from-bottom-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">🌿</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-3 shadow-md border border-purple-100 dark:border-purple-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-sm text-purple-600">Dr. Harmony is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input Area - Purple Theme */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-purple-200 dark:border-purple-700">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Tell Dr. Harmony how you're feeling... 💭"
                disabled={isLoading}
                className="rounded-3xl border-purple-200 dark:border-purple-700 focus:border-purple-400 pl-4 pr-4 py-3 bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              size="icon"
              className="rounded-full w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-center mt-3 gap-2">
            <span className="text-xs text-purple-600 dark:text-purple-400">🌿</span>
            <p className="text-xs text-purple-600 dark:text-purple-400 text-center">
              Describe your symptoms naturally
            </p>
            <span className="text-xs text-purple-600 dark:text-purple-400">💜</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}