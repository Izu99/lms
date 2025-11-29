"use client";

export default function AuthLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-75"></div>
            </div>

            {/* Modern Loading UI */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Logo with pulse animation */}
                <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-ping"></div>
                    <div className="relative w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                        <svg
                            className="w-12 h-12 text-white"
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

                {/* Brand Name */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">ezyICT</h1>
                    <p className="text-blue-200 text-sm font-medium tracking-widest uppercase">
                        Smart Learning Made Easy
                    </p>
                </div>

                {/* Modern Spinner */}
                <div className="relative w-16 h-16">
                    {/* Outer spinning ring */}
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>

                    {/* Inner spinning ring */}
                    <div className="absolute inset-2 border-4 border-white/20 rounded-full"></div>
                    <div className="absolute inset-2 border-4 border-transparent border-t-blue-200 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-3">
                    <p className="text-white text-lg font-medium">Loading your experience</p>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-75 {
          animation-delay: 0.75s;
        }
      `}</style>
        </div>
    );
}
