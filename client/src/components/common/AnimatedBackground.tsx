"use client";

import { useEffect, useState } from "react";

interface AnimatedBackgroundProps {
    variant?: "student" | "teacher" | "default";
}

export function AnimatedBackground({ variant = "default" }: AnimatedBackgroundProps) {
    const [floatingElementStyles, setFloatingElementStyles] = useState<React.CSSProperties[]>([]);

    useEffect(() => {
        const elements = Array.from({ length: 15 }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
        }));
        setFloatingElementStyles(elements);
    }, []);

    // Color configurations based on variant
    const colors = {
        teacher: {
            orb1: "bg-purple-500/20",
            orb2: "bg-indigo-500/20",
            particle: "bg-white/20" // Teacher side usually has lighter background or needs contrast
        },
        student: {
            orb1: "bg-cyan-500/10",
            orb2: "bg-blue-600/10",
            particle: "bg-blue-400/20" // Subtle blue particles for students
        },
        default: {
            orb1: "bg-slate-500/10",
            orb2: "bg-gray-500/10",
            particle: "bg-slate-400/20"
        }
    };

    const theme = colors[variant];

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Large Gradient Orbs */}
            <div className={`absolute top-1/4 -left-1/4 w-96 h-96 ${theme.orb1} rounded-full blur-3xl`}></div>
            <div className={`absolute bottom-1/4 -right-1/4 w-96 h-96 ${theme.orb2} rounded-full blur-3xl`}></div>

            {/* Floating Particles */}
            {floatingElementStyles.map((style, i) => (
                <div
                    key={i}
                    className={`absolute w-2 h-2 ${theme.particle} rounded-full`}
                    style={style}
                />
            ))}

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(120deg); }
          66% { transform: translateY(10px) translateX(-10px) rotate(240deg); }
        }
      `}</style>
        </div>
    );
}
