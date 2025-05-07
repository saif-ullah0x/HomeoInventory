import React from "react";

export function AppLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 96 96"
      fill="none"
      className="h-7 w-7"
    >
      {/* This is a stylized version of the provided medicine container icon */}
      <path
        d="M68 20H28v12h40V20z"
        fill="hsl(var(--primary))"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M68 32v44c0 2.2-1.8 4-4 4H32c-2.2 0-4-1.8-4-4V32"
        fill="hsl(var(--secondary) / 0.8)"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44 48v12M38 54h12"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 20v-4c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}