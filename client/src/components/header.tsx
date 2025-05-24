import * as React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Brain, MessageCircle } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import AIHomeopathyChatbot from "@/components/ai-homeopathy-chatbot";
import LearningPortal from "@/components/learning-portal";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [showAIChatbot, setShowAIChatbot] = React.useState(false);
  const [showLearningSystem, setShowLearningSystem] = React.useState(false);

  const toggleTheme = () => {
    // Simply toggle the theme - no animation needed
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-background border-b shadow-sm glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center slide-up-fade-in">
            <Link href="/">
              <h1 
                className="font-display text-2xl font-bold cursor-pointer premium-gradient-text premium-logo"
                data-text="HomeoInvent"
              >
                HomeoInvent
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {/* AI Helper */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAIChatbot(true)}
              className="premium-gradient-button bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0 flex items-center space-x-1 premium-glow"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">AI Helper</span>
            </Button>

            {/* AI Learning Feature */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowLearningSystem(true)}
              className="premium-gradient-button bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 flex items-center space-x-1 premium-glow"
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Learn</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleTheme}
              className="premium-simple-button border-2 dark:border-slate-600 hover:border-primary dark:hover:border-primary transition-all duration-200 flex items-center space-x-1 relative overflow-hidden group"
              style={{ 
                boxShadow: `0 0 12px rgba(${theme === 'dark' ? '252, 232, 131, 0.4' : '124, 58, 237, 0.4'})`
              }}
            >
              <div className="absolute inset-0 opacity-0 dark:opacity-10 bg-primary group-hover:opacity-20 transition-opacity duration-200 rounded-sm"></div>
              {theme === "dark" ? (
                <Sun className="h-5 w-5 mr-1 text-yellow-500 drop-shadow-md" />
              ) : (
                <Moon className="h-5 w-5 mr-1 text-indigo-600 drop-shadow-md" />
              )}
              <span className="hidden sm:inline font-medium">Theme</span>
            </Button>
          </div>
        </div>
      </div>

      {/* AI Learning Modals */}
      <AIHomeopathyChatbot isOpen={showAIChatbot} onClose={() => setShowAIChatbot(false)} />
      <LearningPortal isOpen={showLearningSystem} onClose={() => setShowLearningSystem(false)} />
    </header>
  );
}
