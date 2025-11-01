"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  GraduationCap,
  Quote,
  Star,
  BookOpen,
  Target,
  UserPlus,
} from "lucide-react";
import { API_URL } from "@/lib/constants";
import Step1 from "@/components/register/Step1";
import Step2 from "@/components/register/Step2";
import Step3 from "@/components/register/Step3";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    address: "",
    institute: "",
    district: "",
    phoneNumber: "",
    whatsappNumber: "",
    telegramNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  const motivationalQuotes = [
    {
      text: "The journey of a thousand miles begins with one step.",
      author: "Lao Tzu",
      icon: Target,
    },
    {
      text: "Success is where preparation and opportunity meet.",
      author: "Bobby Unser",
      icon: Star,
    },
    {
      text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
      author: "Malcolm X",
      icon: BookOpen,
    },
    {
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins",
      icon: UserPlus,
    },
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/register`, data);
      window.location.href = "/login";
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
    setLoading(false);
  }

  const quote = motivationalQuotes[currentQuote];
  const QuoteIcon = quote.icon;

  return (
    <div className="min-h-screen flex h-screen">
      {/* Left side - Enhanced Branding with Motivational Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
          {/* Floating Elements */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  4 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          {/* Logo Section */}
          <div
            className={`flex items-center gap-4 mb-16 transform transition-all duration-1000 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
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
              <h1 className="text-5xl font-bold bg-gradient-to-r mt-5 from-white to-emerald-100 bg-clip-text text-transparent">
                EduFlow
              </h1>
              <p className="text-emerald-200 text-sm font-medium tracking-widest uppercase">
                ICT Learning Hub
              </p>
            </div>
          </div>

          {/* Main Welcome Message */}
          <div
            className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Begin Your
              <span className="block text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text mt-2">
                Learning Adventure
              </span>
            </h2>
            <p className="text-xl text-emerald-100 max-w-lg mx-auto leading-relaxed">
              Join our ICT A-Level community and unlock access to programming
              tutorials, assignments, and exam preparation resources.
            </p>
          </div>

          {/* Motivational Quote Section */}
          <div
            className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-lg w-full transform transition-all duration-1000 delay-500 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <QuoteIcon className="w-6 h-6 text-emerald-200" />
                </div>
              </div>
              <div className="flex-1">
                <Quote className="w-6 h-6 text-emerald-200 mb-3 opacity-60" />
                <blockquote
                  className="text-lg font-medium text-white leading-relaxed mb-4 transition-all duration-500"
                  key={currentQuote}
                >
                  `{quote.text}`
                </blockquote>
                <cite className="text-emerald-200 text-sm font-semibold">
                  — {quote.author}
                </cite>
              </div>
            </div>

            {/* Quote Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {motivationalQuotes.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuote ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form with Emerald Theme */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-emerald-50 relative min-h-screen">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile branding */}
          <div
            className={`lg:hidden text-center mb-8 transform transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-100 rounded-xl blur-sm"></div>
                <GraduationCap
                  size={40}
                  className="relative text-emerald-600"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">EduFlow</h1>
                <p className="text-xs text-emerald-600 font-medium tracking-wider uppercase">
                  ICT Learning Hub
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 transform transition-all duration-700 delay-200 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{
              boxShadow:
                "0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)",
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Create Account
              </h2>
              <p className="text-gray-600 text-lg">
                Join our learning community today
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-4"></div>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {step === 1 && (
                <Step1 data={data} setData={setData} nextStep={nextStep} />
              )}
              {step === 2 && (
                <Step2
                  data={data}
                  setData={setData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {step === 3 && (
                <Step3
                  data={data}
                  setData={setData}
                  prevStep={prevStep}
                  handleSubmit={handleRegister}
                  loading={loading}
                />
              )}

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-xl text-sm text-center font-medium">
                  {error}
                </div>
              )}
            </form>

            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-white text-gray-500 font-medium">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="relative text-green-600 hover:text-teal-700 font-semibold text-md transition-colors duration-300 group inline-block"
                >
                  Sign In Instead
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-teal-600 group-hover:w-full transition-all duration-300"></span>
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
