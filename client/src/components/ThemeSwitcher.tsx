"use client"
import { useEffect, useState } from "react";
import { themes } from "@/lib/theme";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  return (
    <button
      className="rounded px-2 py-1 border mt-4"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      Switch to {theme === "light" ? "dark" : "light"}
    </button>
  );
}
