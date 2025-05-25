import * as React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Brain, MessageCircle } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import AIHomeopathyChatbot from "@/components/ai-homeopathy-chatbot";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [showAIChatbot, setShowAIChatbot] = React.useState(false);

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
                className="font-display text-2xl font-bold cursor-pointer premium-logo"
                data-text="HomeoInvent"
                style={{
                  background: "linear-gradient(to right, #a855f7, #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 15px rgba(168, 85, 247, 0.5)"
                }}
              >
                HomeoInvent
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* AI Helper */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAIChatbot(true)}
              className="premium-gradient-button bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0 flex items-center justify-center h-10 px-3 sm:px-4 rounded-lg premium-glow"
            >
              <MessageCircle className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline font-medium">AI Helper</span>
            </Button>

            {/* AI Learning Feature - Now as Tab Navigation */}
            <Link href="/learning">
              <Button 
                variant="outline" 
                size="sm"
                className={`premium-gradient-button bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 flex items-center justify-center h-10 px-3 sm:px-4 rounded-lg premium-glow ${
                  location === '/learning' ? 'ring-2 ring-white/50' : ''
                }`}
              >
                <Brain className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline font-medium">Learn</span>
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleTheme}
              className="premium-simple-button border border-purple-200 dark:border-slate-600 hover:border-primary dark:hover:border-primary transition-all duration-500 flex items-center justify-center h-10 px-3 sm:px-4 rounded-lg relative overflow-hidden group"
              style={{ 
                boxShadow: `0 0 12px rgba(${theme === 'dark' ? '252, 232, 131, 0.4' : '124, 58, 237, 0.4'})`
              }}
            >
              <div className="absolute inset-0 opacity-0 dark:opacity-10 bg-gradient-to-r from-yellow-200 to-purple-300 dark:from-purple-800 dark:to-indigo-900 group-hover:opacity-20 transition-opacity duration-500 rounded-lg"></div>
              {theme === "dark" ? (
                <Sun className="h-5 w-5 sm:mr-1.5 text-yellow-500 drop-shadow-md" />
              ) : (
                <Moon className="h-5 w-5 sm:mr-1.5 text-indigo-600 drop-shadow-md" />
              )}
              <span className="hidden sm:inline font-medium">Theme</span>
            </Button>
          </div>
        </div>
      </div>

      {/* AI Chatbot Modal */}
      <AIHomeopathyChatbot isOpen={showAIChatbot} onClose={() => setShowAIChatbot(false)} />
    </header>
  );
}
