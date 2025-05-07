import React from "react";
import { useTheme } from "@/components/theme-provider";

export function AppLogo() {
  const { theme } = useTheme();
  
  // Choose color based on theme - match the purple gradient color
  const primaryColor = theme === "dark" ? "hsl(252 95% 70%)" : "hsl(250 95% 64%)";
  const secondaryColor = "hsl(262 83% 58%)";
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 96 96"
      fill="none"
      className="h-7 w-7"
    >
      {/* Stylized medicine container icon with gradient fill */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      
      {/* Top cap */}
      <path
        d="M68 20H28v12h40V20z"
        fill="url(#logoGradient)"
        stroke={theme === "dark" ? "#ffffff30" : "#00000020"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Bottle body */}
      <path
        d="M68 32v44c0 2.2-1.8 4-4 4H32c-2.2 0-4-1.8-4-4V32"
        fill="url(#logoGradient)"
        stroke={theme === "dark" ? "#ffffff30" : "#00000020"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Medicine cross */}
      <path
        d="M44 48v12M38 54h12"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Bottle neck */}
      <path
        d="M36 20v-4c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v4"
        fill="none"
        stroke={theme === "dark" ? "#ffffff30" : "#00000020"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}