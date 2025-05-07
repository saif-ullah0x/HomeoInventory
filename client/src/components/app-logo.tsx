import React from "react";
import { useTheme } from "@/components/theme-provider";

export function AppLogo() {
  const { theme } = useTheme();
  
  // Choose color based on theme - match the purple gradient
  const primaryColor = theme === "dark" ? "hsl(252 95% 70%)" : "hsl(250 95% 64%)";
  const secondaryColor = "hsl(262 83% 58%)";
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 100 120"
      fill="none"
      className="h-8 w-8"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="10%" stopColor={primaryColor} />
          <stop offset="90%" stopColor={secondaryColor} />
        </linearGradient>
        
        {/* Glow effect for the plus sign */}
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Handle/Cap for the bottle */}
      <path
        d="M40 14h20a3 3 0 0 1 3 3v8H37v-8a3 3 0 0 1 3-3z"
        fill={theme === "dark" ? "#664de5" : "#7c4dff"}
        stroke={theme === "dark" ? "#ffffff20" : "#00000010"}
        strokeWidth="1"
      />
      
      {/* Main bottle body with rounded corners */}
      <rect
        x="25"
        y="25"
        width="50"
        height="85"
        rx="6"
        ry="6"
        fill="url(#logoGradient)"
        stroke={theme === "dark" ? "#ffffff20" : "#00000010"}
        strokeWidth="1"
      />
      
      {/* Plus sign in the center with glow effect */}
      <g filter="url(#glow)">
        <path
          d="M50 50v35M32.5 67.5h35"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      
      {/* Highlight on the bottle for dimension */}
      <path
        d="M30 30a48 90 0 0 1 20 70"
        stroke="white"
        strokeWidth="1"
        strokeOpacity="0.3"
        fill="none"
      />
      
      {/* Small details on bottle cap */}
      <rect
        x="42"
        y="17"
        width="16"
        height="3"
        rx="1"
        fill={theme === "dark" ? "#ffffff30" : "#00000020"}
      />
    </svg>
  );
}