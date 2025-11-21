"use client";

import React, { useState, useEffect } from 'react';

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
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

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center relative">
      {/* Animated Background Particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>

      {/* Main Loading Container */}
      <div className="relative z-10 text-center fade-in">
        {/* Logo with Floating Animation */}
        <div className="logo-container mb-8">
          <div className="logo-glow inline-block">
            <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background Circle */}
              <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" opacity="0.9"/>
              
              {/* ICT Lines */}
              <path d="M30 40h40M30 50h40M30 60h28" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              
              {/* Green Notification Dot */}
              <circle cx="75" cy="25" r="12" fill="#22c55e">
                <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite"/>
              </circle>
              
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100">
                  <stop offset="0%" stopColor="#3b82f6"/>
                  <stop offset="100%" stopColor="#2563eb"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-5xl font-bold text-white mb-2">
          ezy<span className="text-blue-400">ICT</span>
        </h1>
        <p className="text-gray-400 text-sm mb-12">Learning Management System</p>

        {/* Animated Spinner with Rings */}
        <div className="relative inline-block mb-8">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="loader-circle"></div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center items-center space-x-3 mb-6">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        {/* Loading Text */}
        <p className="text-white text-lg font-medium loading-text mb-8">
          {messages[messageIndex]}
        </p>

        {/* Progress Bar */}
        <div className="max-w-xs mx-auto mb-4">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-gray-500 text-sm">
          Please wait while we load your dashboard
        </p>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>

      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          position: relative;
          overflow: hidden;
        }

        /* Animated Background Particles */
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .particle-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          top: -150px;
          left: -150px;
          animation: float1 20s infinite ease-in-out;
        }

        .particle-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%);
          bottom: -200px;
          right: -200px;
          animation: float2 25s infinite ease-in-out;
        }

        .particle-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
          top: 40%;
          right: 10%;
          animation: float3 18s infinite ease-in-out;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(120px, 80px) scale(1.2); }
          66% { transform: translate(-80px, 120px) scale(0.9); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-100px, -80px) scale(1.15); }
          66% { transform: translate(80px, -100px) scale(0.95); }
        }

        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-120px, 100px) scale(1.25); }
        }

        /* Logo Animation */
        .logo-container {
          animation: logoFloat 3s ease-in-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .logo-glow {
          filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.6));
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.6)); }
          50% { filter: drop-shadow(0 0 50px rgba(59, 130, 246, 0.8)); }
        }

        /* Circular Progress Loader */
        .loader-circle {
          width: 120px;
          height: 120px;
          border: 4px solid rgba(59, 130, 246, 0.1);
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Dots Loader */
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          animation: dotBounce 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; background: #22c55e; }
        .dot:nth-child(3) { animation-delay: 0s; }

        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Progress Bar */
        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(59, 130, 246, 0.2);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #22c55e, #3b82f6);
          background-size: 200% 100%;
          animation: progressSlide 2s ease-in-out infinite;
          border-radius: 2px;
          width: 0%;
          animation: progressFill 3s ease-out infinite;
        }

        @keyframes progressSlide {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes progressFill {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        /* Text Animation */
        .loading-text {
          animation: textFade 2s ease-in-out infinite;
        }

        @keyframes textFade {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* Spinning Rings */
        .ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid transparent;
        }

        .ring-1 {
          width: 140px;
          height: 140px;
          border-top-color: #3b82f6;
          border-right-color: #3b82f6;
          animation: spinRing 2s linear infinite;
        }

        .ring-2 {
          width: 110px;
          height: 110px;
          border-bottom-color: #22c55e;
          border-left-color: #22c55e;
          animation: spinRing 3s linear infinite reverse;
        }

        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Fade In Animation */
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
