"use client";  
import { useState, useEffect } from "react";
import {
  GraduationCap,
  User,
  Lock,
  Eye,
  EyeOff,
  Quote,
  Star,
  BookOpen,
  Target,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import Cookies from 'js-cookie';
import { useTheme } from 'next-themes';

export default function LoginPage() {
  const { setTheme } = useTheme();
  const [data, setData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [floatingElementStyles, setFloatingElementStyles] = useState<React.CSSProperties[]>([]);

  const motivationalQuotes = [
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela",
      icon: Target,
    },
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King",
      icon: Star,
    },
    {
      text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice.",
      author: "Pele",
      icon: BookOpen,
    },
    {
      text: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
      icon: Target,
    },
  ];

  useEffect(() => {
    setMounted(true);

    const generatedStyles = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 4}s`,
    }));
    setFloatingElementStyles(generatedStyles);

    // Change quote every 4 seconds
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  // Fixed login function with proper form handling
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Using fetch (you can replace with axios if preferred)
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const result = await response.json();

      // Store token in localStorage (consistent with the rest of the app)
      localStorage.setItem("token", result.token);

      // Store user data for role-based routing
      const userData = {
        id: result.id || result.user?.id || result.userId,
        username: result.username || result.user?.username,
        role: result.role || result.user?.role,
        firstName: result.firstName || result.user?.firstName,
        lastName: result.lastName || result.user?.lastName
      };

      console.log("Login successful - User data:", userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Also store in cookie as backup
      Cookies.set("token", result.token, { expires: 7 });

      window.location.href = "/";
    } catch (e) {
      setError((e instanceof Error) ? e.message : "Something went wrong");
    }
    setLoading(false);
  }

  const quote = motivationalQuotes[currentQuote];
  const QuoteIcon = quote.icon;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Enhanced Branding with Motivational Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
          {/* Floating Elements */}
          {floatingElementStyles.map((style, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={style}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          {/* Logo Section */}
          <div
            className={`flex items-center gap-4 mb-16 transform transition-all duration-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm transform rotate-6"></div>
              <GraduationCap
                size={52}
                className="relative text-white drop-shadow-lg"
              />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r mt-5 from-white to-blue-100 bg-clip-text text-transparent">
                ezyICT
              </h1>
              <p className="text-blue-200 text-sm font-medium tracking-widest uppercase">
                Smart Learning Made Easy
              </p>
            </div>
          </div>

          {/* Main Welcome Message */}
          <div
            className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
          >
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Welcome Back to Your
              <span className="block text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text mt-2">
                Learning Journey
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-lg mx-auto leading-relaxed">
              Access your ICT coursework, programming assignments, and track
              your A-Level progress in one unified platform.
            </p>
          </div>

          {/* Motivational Quote Section */}
          <div
            className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-lg w-full transform transition-all duration-1000 delay-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <QuoteIcon className="w-6 h-6 text-blue-200" />
                </div>
              </div>
              <div className="flex-1">
                <Quote className="w-6 h-6 text-blue-200 mb-3 opacity-60" />
                <blockquote
                  className="text-lg font-medium text-white leading-relaxed mb-4 transition-all duration-500"
                  key={currentQuote}
                >
                  `{quote.text}`
                </blockquote>
                <cite className="text-blue-200 text-sm font-semibold">
                  — {quote.author}
                </cite>
              </div>
            </div>

            {/* Quote Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {motivationalQuotes.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentQuote ? "bg-white" : "bg-white/30"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Message for Students */}
          <div
            className={`mt-12 text-center transform transition-all duration-1000 delay-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-blue-100 font-medium">
                Empowering Future Tech Leaders
              </span>
              <Star className="w-5 h-5 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form with Blue Theme */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile branding */}
          <div
            className={`lg:hidden text-center mb-8 transform transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-xl blur-sm"></div>
                <GraduationCap size={40} className="relative text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">ezyICT</h1>
                <p className="text-xs text-primary font-medium tracking-wider uppercase">
                  Smart Learning Made Easy
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform transition-all duration-700 delay-200 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            style={{
              boxShadow:
                "0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 10px 20px -5px rgba(59, 130, 246, 0.1)",
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome Back
              </h2>
              <p className="text-muted-foreground text-lg">
                Sign in to access your learning dashboard
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4"></div>
            </div>

            {/* THIS IS THE KEY FIX - Added the form element with onSubmit */}
            <form onSubmit={handleLogin} className="space-y-6" role="form">
              <div className="space-y-2">
                <label htmlFor="login-identifier" className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  Username, Email, or Phone Number
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200"
                    size={20}
                  />
                  <Input
                    id="login-identifier"
                    name="identifier"
                    placeholder="Enter your username, email, or phone number"
                    value={data.identifier}
                    onChange={(e) =>
                      setData({ ...data, identifier: e.target.value })
                    }
                    className="pl-12 h-14 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-lg font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Lock size={16} className="text-primary" />
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200"
                    size={20}
                  />
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    className="pl-12 pr-14 h-14 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-lg font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl transition-all duration-500 transform hover:scale-104 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Sign In to Dashboard</span>
                )}
              </Button>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-xl text-sm text-center font-medium">
                  {error}
                </div>
              )}
            </form>

            <div className="mt-8 space-y-4">
              <div className="text-center">
                <Link
                  href="/auth/forgot"
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-all duration-200 inline-flex items-center gap-1"
                >
                  Forgot your password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-8 bg-white text-gray-500 font-medium">
                    New to ezyICT?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/register"
                  className="relative text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-300 group inline-block"
                >
                  Create New Account
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) translateX(10px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) translateX(-10px) rotate(240deg);
          }
        }
      `}</style>
    </div>
  );
}
