import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  Pill
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        content: "Hello! I'm your AI Homeopathic Assistant. I can help suggest remedies based on classical materia medica sources like Boericke, Kent, and Clarke.\n\nPlease describe your symptoms, and I'll provide suggestions from established homeopathic literature. Remember, this is for educational purposes only and should not replace professional medical advice.\n\nWhat symptoms would you like help with today?",
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
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            AI Homeopathic Doctor
          </DialogTitle>
          <DialogDescription>
            Get remedy suggestions based on classical homeopathic materia medica
          </DialogDescription>
        </DialogHeader>
        
        {/* Medical Disclaimer */}
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Disclaimer:</strong> This AI provides educational information based on homeopathic literature. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. 
            Always consult qualified healthcare providers for serious health conditions.
          </AlertDescription>
        </Alert>
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 h-[400px] border rounded-lg p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    {message.type === 'ai' && <Bot className="h-4 w-4 mt-0.5 text-primary" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Remedy Suggestions */}
                      {message.remedies && message.remedies.length > 0 && (
                        <div className="mt-3 space-y-3">
                          <h4 className="font-medium text-sm flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            Suggested Remedies:
                          </h4>
                          {message.remedies.map((remedy, remedyIndex) => (
                            <div key={remedyIndex} className="border rounded-lg p-3 bg-background/50">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Pill className="h-4 w-4 text-primary" />
                                  <span className="font-medium text-sm">
                                    {remedy.name} {remedy.potency}
                                  </span>
                                  {remedy.inInventory && (
                                    <Badge variant="secondary" className="text-xs">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      In Inventory
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-xs text-muted-foreground mb-2">
                                <strong>Indication:</strong> {remedy.indication}
                              </p>
                              
                              <p className="text-xs text-muted-foreground mb-2">
                                <strong>Reasoning:</strong> {remedy.reasoning}
                              </p>
                              
                              <p className="text-xs font-medium text-primary">
                                <strong>Source:</strong> {remedy.source}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyzing symptoms...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe your symptoms... (e.g., 'continuous headache with restlessness and thirst')"
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={clearChat}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              Clear
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}