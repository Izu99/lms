"use client"
import { useEffect, useState } from "react";
// import { themes } from "@/lib/theme"; // themes is no longer needed if only dark is active

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark"); // Always dark
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  // No button or switching logic needed as per user request
  return null; // Render nothing since there's no interaction
}
