"use client";

import React, { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const messages = [
    "Initializing system...",
    "Loading your courses...",
    "Setting up dashboard...",
    "Almost ready...",
    "Preparing your learning experience..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      
      {/* Subtle Dark Orbs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl"></div>

      {/* Main Card */}
      <div className="relative z-10 backdrop-blur-xl bg-slate-900/95 border border-slate-800 rounded-3xl p-12 shadow-2xl shadow-black/50 max-w-md w-full mx-4">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            {/* Animated Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping"></div>
            
            {/* Logo Container - Dark with subtle accent */}
            <div className="relative w-28 h-28 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
              <svg
                className="w-14 h-14 text-emerald-400 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>

          {/* Brand */}
          <h1 className="text-5xl font-black mb-2 tracking-tight">
            <span className="text-slate-100">ezy</span>
            <span className="text-slate-400">ICT</span>
          </h1>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
            <p className="text-slate-500 text-sm font-semibold tracking-widest uppercase">
              Learning Platform
            </p>
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-slate-600 text-xs font-medium">System Online</p>
          </div>
        </div>

        {/* Advanced Spinner */}
        <div className="flex justify-center mb-10">
          <div className="relative w-24 h-24">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500 animate-spin"></div>

            {/* Middle ring */}
            <div className="absolute inset-3 rounded-full border-4 border-slate-800"></div>
            <div className="absolute inset-3 rounded-full border-4 border-transparent border-r-slate-600 border-b-slate-600 animate-spin-slow"></div>

            {/* Inner ring */}
            <div className="absolute inset-6 rounded-full border-4 border-slate-800"></div>
            <div className="absolute inset-6 rounded-full border-4 border-transparent border-b-emerald-600 border-l-emerald-600 animate-spin-reverse"></div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center mb-8">
          <p className="text-slate-200 text-lg font-semibold mb-4 transition-all duration-300">
            {messages[messageIndex]}
          </p>

          {/* Animated Dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></div>
            <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2.5 h-2.5 bg-emerald-700 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Modern Progress Bar */}
        <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden mb-3 border border-slate-700">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Progress Info */}
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-xs font-medium">
            Loading...
          </p>
          <p className="text-emerald-400 text-sm font-bold">
            {progress}%
          </p>
        </div>

        {/* Tech Indicators */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-slate-600 text-xs">Secure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <span className="text-slate-600 text-xs">Fast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <span className="text-slate-600 text-xs">Modern</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}