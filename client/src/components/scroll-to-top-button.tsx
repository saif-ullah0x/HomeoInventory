/**
 * Scroll to Top Button Component
 * Shows when user scrolls down, provides smooth animation back to top
 * Used in Learning Assistant and main app for better UX
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

interface ScrollToTopButtonProps {
  showThreshold?: number; // How far user needs to scroll before button appears
  className?: string;
}

export function ScrollToTopButton({ 
  showThreshold = 300, 
  className = "" 
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down past threshold
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showThreshold]);

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110 animate-bounce ${className}`}
      size="sm"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}