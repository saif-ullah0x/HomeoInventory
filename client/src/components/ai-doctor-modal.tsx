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
        content: "Hello! I'm your AI Homeopathic Doctor 👨‍⚕️\n\nI can suggest remedies based on classical materia medica from Kent, Boericke, Clarke, and other established sources.\n\nTell me about your symptoms and I'll help find suitable homeopathic remedies! For example:\n• 'Headache with anxiety'\n• 'Stomach pain after eating'\n• 'Difficulty sleeping with restlessness'",
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
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">AI Homeopathic Doctor</h3>
              <p className="text-sm text-muted-foreground">Based on classical materia medica</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Medical Disclaimer
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-left space-y-2">
                    <p>
                      This AI provides <strong>educational information</strong> based on homeopathic literature including works by Kent, Boericke, Clarke, and other classical sources.
                    </p>
                    <p>
                      <strong>Important:</strong> This is <strong>not a substitute</strong> for professional medical advice, diagnosis, or treatment.
                    </p>
                    <p>
                      Always consult qualified healthcare providers for serious health conditions or before making any medical decisions.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogAction>I Understand</AlertDialogAction>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-md' 
                    : 'bg-muted rounded-bl-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  
                  {/* Remedy Suggestions */}
                  {message.remedies && message.remedies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-medium text-sm flex items-center gap-2 text-primary">
                        <BookOpen className="h-4 w-4" />
                        Suggested Remedies
                      </h4>
                      {message.remedies.map((remedy, remedyIndex) => (
                        <div key={remedyIndex} className="border rounded-xl p-3 bg-background/80 backdrop-blur-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Pill className="h-4 w-4 text-primary" />
                              <span className="font-medium text-sm">
                                {remedy.name} {remedy.potency}
                              </span>
                              {remedy.inInventory && (
                                <Badge variant="secondary" className="text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  In Stock
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2">
                            <strong>For:</strong> {remedy.indication}
                          </p>
                          
                          <p className="text-xs text-muted-foreground mb-2">
                            <strong>Why:</strong> {remedy.reasoning}
                          </p>
                          
                          <p className="text-xs font-medium text-primary">
                            <strong>Source:</strong> {remedy.source}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm">Analyzing symptoms...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your symptoms here..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              size="icon"
              className="rounded-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Describe symptoms like "headache with restlessness" or "stomach pain after eating"
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}