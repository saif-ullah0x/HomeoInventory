/**
 * Learning Tab Scroll to Top Button
 * Positioned in the medicine display area, appears when scrolling down
 * Uses container-specific scrolling for the Learning tab
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

interface LearningScrollButtonProps {
  showThreshold?: number;
}

export function LearningScrollButton({ showThreshold = 200 }: LearningScrollButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find the ScrollArea viewport in the Learning tab
      const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
      
      if (scrollContainer) {
        const scrollY = scrollContainer.scrollTop;
        
        if (scrollY > showThreshold) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    // Add scroll listener to the scroll container
    const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [showThreshold]);

  const scrollToTop = () => {
    const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="absolute bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110 animate-bounce"
      size="sm"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}