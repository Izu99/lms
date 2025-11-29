"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation"; // To detect route changes
import LoadingScreen from "./LoadingScreen"; // Import the LoadingScreen

interface ClientLayoutProviderProps {
  children: React.ReactNode;
}

export function ClientLayoutProvider({ children }: ClientLayoutProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isReadyForAnimation, setIsReadyForAnimation] = useState(false); // New state for animation readiness
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Effect to manage the overall loading state (simulated)
  useEffect(() => {
    setIsLoading(true); // Always start as loading
    setIsReadyForAnimation(false); // Reset animation readiness

    // Give browser a moment to parse CSS before showing animated loader
    const animationReadyTimer = setTimeout(() => {
      setIsReadyForAnimation(true);
    }, 50); // Very short delay

    // Simulate initial loading time
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Main loading duration

    return () => {
      clearTimeout(animationReadyTimer);
      clearTimeout(loadingTimer);
    };
  }, [pathname, searchParams]); // Re-run effect on route change

  // If we are still loading AND the animations are ready, show the animated loader
  if (isLoading && isReadyForAnimation) {
    return <LoadingScreen />;
  }

  // If we are not loading, or not yet ready for animation (very brief initial moment),
  // render the actual content. The `body` background set in globals.css will cover
  // the brief moment before `LoadingScreen` is `isReadyForAnimation`.
  if (!isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    );
  }

  // Fallback for the very brief moment before isReadyForAnimation becomes true
  // and while isLoading is true. This should be covered by the dark body background.
  return null;
}