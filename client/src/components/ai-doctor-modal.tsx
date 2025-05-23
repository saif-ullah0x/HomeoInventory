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
        content: "Hello! I'm Dr. Harmony, your friendly homeopathic assistant! 🌿✨\n\nI'm here to help you find gentle, natural remedies based on classical books by Kent, Boericke, Clarke, and other trusted sources.\n\nHow are you feeling today? Share your symptoms with me and I'll suggest the perfect homeopathic remedies for you! 💚\n\nFor example:\n• \"I have a headache with anxiety\"\n• \"Feeling tired and stressed\"\n• \"Stomach pain after eating\"",
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
      <DialogContent className="sm:max-w-[420px] h-[650px] flex flex-col p-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        {/* Header - WhatsApp Style */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white">
          <div className="flex items-center gap-3">
            {/* Cute Doctor Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🩺</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-white">Dr. Harmony</h3>
              <p className="text-xs text-green-100">Online • Homeopathic Assistant</p>
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
                <AlertDialogAction className="bg-green-600 hover:bg-green-700">I Understand</AlertDialogAction>
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-sm">🌿</span>
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm' 
                    : 'bg-white dark:bg-gray-800 rounded-bl-sm border border-green-100 dark:border-green-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  
                  {/* Remedy Suggestions */}
                  {message.remedies && message.remedies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-medium text-sm">Recommended Remedies</span>
                        <span className="text-xs bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                          {message.remedies.length} found
                        </span>
                      </div>
                      {message.remedies.map((remedy, remedyIndex) => (
                        <div key={remedyIndex} className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-xl p-3 border border-green-200 dark:border-green-700">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Pill className="h-3 w-3 text-white" />
                              </div>
                              <span className="font-semibold text-sm text-green-700 dark:text-green-300">
                                {remedy.name} {remedy.potency}
                              </span>
                              {remedy.inInventory && (
                                <Badge className="text-xs bg-green-500 hover:bg-green-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  In Your Kit
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-xs">
                            <p className="flex items-start gap-2">
                              <span className="text-green-600 font-medium">For:</span>
                              <span className="text-gray-700 dark:text-gray-300">{remedy.indication}</span>
                            </p>
                            
                            <p className="flex items-start gap-2">
                              <span className="text-blue-600 font-medium">Why:</span>
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 animate-in slide-in-from-bottom-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">🌿</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-3 shadow-md border border-green-100 dark:border-green-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-sm text-green-600">Dr. Harmony is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input Area - WhatsApp Style */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-green-200 dark:border-green-700">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Tell Dr. Harmony how you're feeling... 💭"
                disabled={isLoading}
                className="rounded-3xl border-green-200 dark:border-green-700 focus:border-green-400 pl-4 pr-4 py-3 bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              size="icon"
              className="rounded-full w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-center mt-3 gap-2">
            <span className="text-xs text-green-600 dark:text-green-400">🌿</span>
            <p className="text-xs text-green-600 dark:text-green-400 text-center">
              Share symptoms like "tired and anxious" or "headache after stress"
            </p>
            <span className="text-xs text-green-600 dark:text-green-400">✨</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}