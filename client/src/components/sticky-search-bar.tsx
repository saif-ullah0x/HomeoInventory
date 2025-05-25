/**
 * Sticky Search Bar Component
 * 
 * Features:
 * - Hides when scrolling down, reappears with upward scroll
 * - Uses blurry glassy background effect
 * - Compact design that takes up less space
 * - No medicine count display in the search area
 */

import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StickySearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  categories: string[];
  isVisible: boolean;
}

export default function StickySearchBar({ 
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  isVisible
}: StickySearchBarProps) {
  return (
    <div 
      className={`sticky top-0 z-10 search-bar-container ${isVisible ? 'search-bar-visible' : 'search-bar-hidden'}`}
    >
      <div className="py-3 px-4 bg-gradient-to-r from-purple-50/95 to-indigo-50/95 dark:from-gray-800/95 dark:to-gray-900/95 border-b backdrop-blur-md shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 items-center">
            {/* Compact Search Bar */}
            <div className="w-64 relative flex-grow-0">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="Search medicines, uses, or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 py-1 h-8 text-sm bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400 shadow-sm"
              />
            </div>
            
            {/* Compact Category Filter */}
            <div className="relative w-48 flex-shrink-0">
              <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-7 pr-7 py-1 h-8 text-sm border border-purple-200 rounded-md bg-white/80 backdrop-blur-sm focus:border-purple-400 appearance-none shadow-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}