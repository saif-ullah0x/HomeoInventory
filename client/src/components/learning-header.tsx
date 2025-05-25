/**
 * Enhanced Learning Assistant Header
 * 
 * Features:
 * - Centered, beautiful "Learning Assistant" title with stylish design
 * - Removes "150 Medicines" text from the header
 * - Uses purple gradient, glassy effects, and animations
 */

import { BookOpen } from "lucide-react";

export default function LearningHeader() {
  return (
    <div className="relative flex flex-col items-center justify-center py-4 px-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-20"></div>
      
      {/* Centered title with animation */}
      <div className="relative flex items-center justify-center z-10 mb-1">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mr-3 shadow-lg animate-pulse">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white text-center animate-fadeIn">
          Learning Assistant
        </h1>
      </div>
    </div>
  );
}