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
import Cookies from 'js-cookie';
import Step1 from "@/components/register/Step1";
import Step2 from "@/components/register/Step2";
import Step3 from "@/components/register/Step3";
import { useTheme } from "next-themes";

interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  address: string;
  telegram: string;
  idCardFront: File | null;
  idCardBack: File | null;
  phoneNumber: string;
  whatsappNumber: string;
  studentType: "Physical" | "Online";
  institute: string;
}

export default function RegisterPage() {
  const { setTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    address: "",
    telegram: "",
    idCardFront: null,
    idCardBack: null,
    phoneNumber: "",
    whatsappNumber: "",
    studentType: "Physical",
    institute: "",
  });
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [floatingElements, setFloatingElements] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const elements = Array.from({ length: 15 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 4}s`,
    }));
    setFloatingElements(elements);
    
    async function fetchInstitutes() {
      try {
        const response = await axios.get(`${API_URL}/institutes`);
        setInstitutes(response.data.institutes);
      } catch (error) {
        console.error("Failed to fetch institutes:", error);
      }
    }
    fetchInstitutes();
  }, []);

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

    // Create FormData and append fields correctly
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('address', data.address || '');
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('whatsappNumber', data.whatsappNumber || '');
    formData.append('telegram', data.telegram || '');
    formData.append('studentType', data.studentType);
    formData.append('institute', data.institute);

    // Handle files separately
    if (data.idCardFront instanceof File) {
      formData.append('idCardFront', data.idCardFront);
    }
    if (data.idCardBack instanceof File) {
      formData.append('idCardBack', data.idCardBack);
    }

    try {
      console.log('Sending registration data:', {
        ...Object.fromEntries(formData.entries()),
        idCardFront: data.idCardFront ? 'File present' : 'No file',
        idCardBack: data.idCardBack ? 'File present' : 'No file'
      });

      const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('Registration response:', response.data);
      
      // Clear any existing data
      localStorage.removeItem("token");
      Cookies.remove("token");
      
      // Registration successful - redirect to login
      alert("Registration successful! Please login with your credentials.");
      window.location.href = "/auth/login";
    } catch (e: unknown) {
      console.error('Registration error:', e);
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          setError(e.response.data.message || "Please check your registration details and try again.");
        } else if (e.response?.status === 409) {
          setError("This username is already taken. Please choose another one.");
        } else {
          setError("Registration failed. Please try again later.");
        }
        console.error('Server response:', e.response?.data);
      } else {
        setError("An unexpected error occurred. Please try again.");
        console.error('Unknown error:', e);
      }
    }
    setLoading(false);
  }

  const quote = motivationalQuotes[currentQuote];
  const QuoteIcon = quote.icon;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Enhanced Branding with Motivational Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
          {/* Floating Elements */}
          {floatingElements.map((style, i) => (
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
                ezyICT
              </h1>
              <p className="text-emerald-200 text-sm font-medium tracking-widest uppercase">
                Smart Learning Made Easy
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
                            Join ezyICT&apos;s ICT A-Level community and unlock access to programming
                            tutorials, assignments, and exam preparation resources.
                          </p>          </div>

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
                  {quote.text}
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
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative min-h-screen">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="w-full max-w-2xl relative z-10">
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
                <h1 className="text-3xl font-bold text-foreground">ezyICT</h1>
                <p className="text-xs text-emerald-600 font-medium tracking-wider uppercase">
                  Smart Learning Made Easy
                </p>
              </div>
            </div>
          </div>

          <div
            className={`bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 transform transition-all duration-700 delay-200 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{
              boxShadow:
                "0 25px 50px -12px rgba(16, 185, 121, 0.25), 0 10px 20px -5px rgba(16, 185, 129, 0.1)",
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Create Account
              </h2>
              <p className="text-muted-foreground text-lg">
                Join our learning community today
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mt-4"></div>
            </div>

            {/* Step Progress Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step >= stepNumber
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div
                        className={`w-12 h-1 mx-2 transition-all duration-300 ${
                          step > stepNumber ? 'bg-emerald-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {step === 1 && (
                <Step1 
                  data={data} 
                  setData={(newData) => setData({ ...data, ...newData })} 
                  nextStep={nextStep} 
                />
              )}
              {step === 2 && (
                <Step2
                  data={data}
                  setData={(newData) => setData({ ...data, ...newData })}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  institutes={institutes}
                />
              )}
              {step === 3 && (
                <Step3
                  data={data}
                  setData={(newData) => setData({ ...data, ...newData })}
                  prevStep={prevStep}
                  handleSubmit={handleRegister}
                  loading={loading}
                  studentType={data.studentType}
                />
              )}

              {error && (
                <div className="bg-destructive/10 border-2 border-destructive/20 text-destructive-foreground px-4 py-4 rounded-xl text-sm text-center font-medium">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-8 bg-white text-gray-500 font-medium">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="relative text-emerald-600 hover:text-teal-700 font-semibold text-lg transition-colors duration-300 group inline-block"
                >
                  Sign In Instead
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:w-full transition-all duration-300"></span>
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