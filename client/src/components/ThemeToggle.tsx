"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // Always dark theme

  useEffect(() => {
    // FORCE DARK THEME - This actively sets dark mode
    // Remove any light theme classes
    document.documentElement.classList.remove("light");
    // Add dark theme class
    document.documentElement.classList.add("dark");
    // Save to localStorage
    localStorage.setItem("theme", "dark");
    // Set state
    setIsDark(true);

    // Also force it on the body
    document.body.classList.add("dark");
    
    // Continuously check and enforce dark theme (in case something tries to change it)
    const enforceInterval = setInterval(() => {
      if (!document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
    }, 100);

    return () => clearInterval(enforceInterval);
  }, []);

  // Disabled toggle function - button does nothing
  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    // Do nothing - theme toggle is disabled
    return false;
  };

  return (
    <button
      onClick={toggleTheme}
      disabled
      className="relative w-14 h-7 bg-gray-700 rounded-full transition-colors duration-300 opacity-50 cursor-not-allowed"
      aria-label="Dark mode (always on)"
      title="Dark mode is enabled. Light mode temporarily disabled."
    >
      <div
        className="absolute top-0.5 left-0.5 w-6 h-6 bg-gray-900 rounded-full shadow-md transform translate-x-7 transition-transform duration-300 flex items-center justify-center"
      >
        <Moon className="w-4 h-4 text-blue-400" />
      </div>
    </button>
  );
}
