"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface SelfHostedVideoPlayerModalProps {
  videoUrl: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SelfHostedVideoPlayerModal({
  videoUrl,
  title,
  isOpen,
  onClose,
}: SelfHostedVideoPlayerModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-50 backdrop-blur-sm"
        aria-label="Close video"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Video Container */}
      <div
        className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside video container
      >
        <video
          src={videoUrl}
          title={title || "Video Player"}
          controls
          autoPlay
          playsInline
          className="w-full h-full border-0 object-cover"
        />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}