"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api-client";
import Link from "next/link";
import {
  GraduationCap,
  Quote,
  Star,
  BookOpen,
  Target,
  UserPlus,
  Eye,
  EyeOff,
  Check,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { PrivacyPolicyModal } from "@/components/modals/PrivacyPolicyModal";

// Custom hook for debouncing
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface Institute {
  _id: string;
  name: string;
  location: string;
  isActive: boolean;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Shadcn Select components

interface Institute {
  _id: string;
  name: string;
  location: string;
  isActive: boolean;
}

interface Year {
  _id: string;
  year: string;  // e.g., "2024-2025"
  name: string;  // e.g., "A/L Batch of 2025"
  isActive?: boolean;
}

// Password Strength Checker
interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

function checkPasswordStrength(password: string): PasswordStrength {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;

  let label = "";
  let color = "";

  if (score === 0) {
    label = "";
    color = "";
  } else if (score <= 2) {
    label = "Weak";
    color = "bg-red-500";
  } else if (score === 3) {
    label = "Fair";
    color = "bg-orange-500";
  } else if (score === 4) {
    label = "Good";
    color = "bg-yellow-500";
  } else {
    label = "Strong";
    color = "bg-green-500";
  }

  return { score, label, color, requirements };
}

interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  telegram: string;
  idCardFront: File | null;
  idCardBack: File | null;
  phoneNumber: string;
  whatsappNumber: string;
  studentType: 'Physical' | 'Online' | '';
  institute: string;
  year: string;
  academicLevel: string;
  apiError?: string;
}

export default function RegisterPage() {
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
    studentType: "",
    institute: "",
    year: "",
    academicLevel: "",
  });
  const [fetchedInstitutes, setFetchedInstitutes] = useState<Institute[]>([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState<Institute[]>([]);
  const [isLoadingInstitutes, setIsLoadingInstitutes] = useState(false);
  const [instituteError, setInstituteError] = useState<string | null>(null);
  const [fetchedYears, setFetchedYears] = useState<Year[]>([]);
  const [isLoadingYears, setIsLoadingYears] = useState(false);
  const [yearError, setYearError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterData, string>>>({});
  const [usernameAvailability, setUsernameAvailability] = useState<{
    status: "idle" | "checking" | "available" | "unavailable";
    message: string;
  }>({ status: "idle", message: "" });
  const [mounted, setMounted] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [floatingElements, setFloatingElements] = useState<React.CSSProperties[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: "",
    color: "",
    requirements: {
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
  });
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Debounce the username input
  const debouncedUsername = useDebounce(data.username, 500);

  // Update password strength when password changes
  useEffect(() => {
    if (data.password) {
      setPasswordStrength(checkPasswordStrength(data.password));
    } else {
      setPasswordStrength({
        score: 0,
        label: "",
        color: "",
        requirements: {
          minLength: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasNumber: false,
          hasSpecialChar: false,
        },
      });
    }
  }, [data.password]);

  // Effect to check username availability
  useEffect(() => {
    if (debouncedUsername) {
      checkUsernameAvailability(debouncedUsername);
    } else {
      setUsernameAvailability({ status: "idle", message: "" });
    }
  }, [debouncedUsername]);

  const checkUsernameAvailability = async (username: string) => {
    setUsernameAvailability({ status: "checking", message: "Checking username..." });
    try {
      const response = await api.post<{ available: boolean }>("/auth/check-username", { username });
      if (response.data.available) {
        setUsernameAvailability({ status: "available", message: "Username is available!" });
      } else {
        setUsernameAvailability({ status: "unavailable", message: "Username is not available." });
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
      setUsernameAvailability({ status: "unavailable", message: "Error checking username." });
    }
  };

  // Function to fetch institutes from the backend
  const fetchInstitutes = async () => {
    setIsLoadingInstitutes(true);
    setInstituteError(null);
    try {
      const response = await api.get<{ institutes: Institute[] }>("/institutes");
      setFetchedInstitutes(response.data.institutes || []);
    } catch (error) {
      console.error("Error fetching institutes:", error);
      setInstituteError("Failed to load institutes. Please try again.");
    } finally {
      setIsLoadingInstitutes(false);
    }
  };

  // Function to fetch years from the backend
  const fetchYears = async () => {
    setIsLoadingYears(true);
    setYearError(null);
    try {
      const response = await api.get<{ years: Year[] }>("/years");
      setFetchedYears(response.data.years || []);
    } catch (error) {
      console.error("Error fetching years:", error);
      setYearError("Failed to load years. Please try again.");
    } finally {
      setIsLoadingYears(false);
    }
  };

  // Effect to fetch institutes and years on component mount
  useEffect(() => {
    fetchInstitutes();
    fetchYears();
  }, []);

  // Set all institutes without filtering
  useEffect(() => {
    setFilteredInstitutes(fetchedInstitutes);
  }, [fetchedInstitutes]);

  useEffect(() => {
    const elements = Array.from({ length: 15 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 4}s`,
    }));
    setFloatingElements(elements);
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

  const nextStep = () => {
    const newErrors: Partial<Record<keyof RegisterData, string>> = {};
    if (step === 1) {
      if (!data.firstName) newErrors.firstName = "First name is required";
      if (!data.lastName) newErrors.lastName = "Last name is required";
      if (!data.username) newErrors.username = "Username is required";
      if (!data.email) newErrors.email = "Email is required";
      if (!data.password) newErrors.password = "Password is required";
      if (!data.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
      if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (passwordStrength.score < 3) {
        newErrors.password = "Please choose a stronger password";
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setStep((prev) => prev + 1);
      }
    } else if (step === 2) {
      if (!data.phoneNumber) newErrors.phoneNumber = "Phone number is required";
      if (!data.academicLevel) newErrors.academicLevel = "Academic level is required";
      if (!data.studentType) newErrors.studentType = "Student type is required";
      if (!data.institute) newErrors.institute = "Institute is required";
      if (!data.year) newErrors.year = "Year is required";

      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setStep((prev) => prev + 1);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!isPrivacyAccepted) {
      setErrors({ apiError: "You must accept the Privacy Policy to register." });
      setLoading(false);
      return;
    }

    if (data.password !== data.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }

    // Validate ID card for AL Physical students only
    const requiresIdCard = data.academicLevel === 'AL' && data.studentType === 'Physical';
    if (requiresIdCard && (!data.idCardFront || !data.idCardBack)) {
      setErrors({ apiError: "ID card front and back are required for AL Physical students." });
      setLoading(false);
      return;
    }

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
    formData.append('year', data.year);
    formData.append('academicLevel', data.academicLevel);

    // Only append ID cards if they exist (for AL Physical students)
    if (data.idCardFront) {
      formData.append('idCardFront', data.idCardFront);
    }
    if (data.idCardBack) {
      formData.append('idCardBack', data.idCardBack);
    }

    try {
      await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert("Registration successful! Please login with your new credentials.");
      // Redirect to login page
      window.location.href = '/login';

    } catch (err: unknown) {
      console.error("Registration failed:", err);
      console.error("Registration failed:", err);
      // @ts-ignore - Basic error handling for now
      if (err.response) {
        // @ts-ignore
        setErrors({ apiError: err.response.data.message || 'An error occurred during registration.' });
      } else {
        setErrors({ apiError: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const quote = motivationalQuotes[currentQuote];
  const QuoteIcon = quote.icon;

  return (
    <>
      <PrivacyPolicyModal open={isPrivacyModalOpen} onOpenChange={setIsPrivacyModalOpen} />
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
              className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
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
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentQuote ? "bg-white" : "bg-white/30"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register Form with Emerald Theme */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 relative min-h-screen">
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
              className={`lg:hidden text-center mb-8 transform transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
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
                  <h1 className="text-3xl font-bold text-gray-900">ezyICT</h1>
                  <p className="text-xs text-emerald-600 font-medium tracking-wider uppercase">
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
                  "0 25px 50px -12px rgba(16, 185, 121, 0.25), 0 10px 20px -5px rgba(16, 185, 129, 0.1)",
              }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-black mb-3">
                  Create Account
                </h2>
                <p className="text-gray-600 text-lg">
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
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= stepNumber
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                          }`}
                      >
                        {stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div
                          className={`w-12 h-1 mx-2 transition-all duration-300 ${step > stepNumber ? 'bg-emerald-500' : 'bg-gray-200'
                            }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="space-y-6">
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div className="space-y-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="firstName" className="form-label">First Name *</label>
                        <input
                          id="firstName"
                          type="text"
                          className="form-input"
                          value={data.firstName}
                          onChange={(e) => setData({ ...data, firstName: e.target.value })}
                          placeholder="Enter first name"
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="form-label">Last Name *</label>
                        <input
                          id="lastName"
                          type="text"
                          className="form-input"
                          value={data.lastName}
                          onChange={(e) => setData({ ...data, lastName: e.target.value })}
                          placeholder="Enter last name"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="username" className="form-label">Username *</label>
                      <input
                        id="username"
                        type="text"
                        className="form-input"
                        value={data.username}
                        onChange={(e) => setData({ ...data, username: e.target.value })}
                        placeholder="Choose a username"
                      />
                      {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                      {usernameAvailability.status !== "idle" && (
                        <p
                          className={`text-sm mt-2 ${usernameAvailability.status === "available"
                            ? "text-green-600"
                            : usernameAvailability.status === "unavailable"
                              ? "text-red-600"
                              : "text-gray-500"
                            }`}
                        >
                          {usernameAvailability.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">Email *</label>
                      <input
                        id="email"
                        type="email"
                        className="form-input"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="password" className="form-label">Password *</label>
                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="form-input pr-10"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            placeholder="Create password"
                          />
                          <span
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </span>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                        <div className="relative">
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-input pr-16" // Increased padding to accommodate both icons
                            value={data.confirmPassword}
                            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                            placeholder="Confirm password"
                          />
                          {data.confirmPassword.length > 0 && (
                            <span
                              className="absolute inset-y-0 right-10 flex items-center" // Position checkmark/cross
                            >
                              {data.password === data.confirmPassword ? (
                                <CheckCircle size={16} className="text-green-500" />
                              ) : (
                                <XCircle size={16} className="text-red-500" />
                              )}
                            </span>
                          )}
                          <span
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </span>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {data.password && (
                      <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                          <span className={`text-sm font-semibold ${passwordStrength.score <= 2 ? 'text-red-600' :
                            passwordStrength.score === 3 ? 'text-orange-600' :
                              passwordStrength.score === 4 ? 'text-yellow-600' :
                                'text-green-600'
                            }`}>
                            {passwordStrength.label}
                          </span>
                        </div>

                        {/* Strength Bar */}
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-2 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.score
                                ? passwordStrength.color
                                : 'bg-gray-200'
                                }`}
                            />
                          ))}
                        </div>

                        {/* Requirements Checklist */}
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center gap-2">
                            {passwordStrength.requirements.minLength ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <X size={16} className="text-gray-400" />
                            )}
                            <span className={`text-xs ${passwordStrength.requirements.minLength ? 'text-green-600' : 'text-gray-600'
                              }`}>
                              At least 8 characters
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordStrength.requirements.hasUpperCase ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <X size={16} className="text-gray-400" />
                            )}
                            <span className={`text-xs ${passwordStrength.requirements.hasUpperCase ? 'text-green-600' : 'text-gray-600'
                              }`}>
                              One uppercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordStrength.requirements.hasLowerCase ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <X size={16} className="text-gray-400" />
                            )}
                            <span className={`text-xs ${passwordStrength.requirements.hasLowerCase ? 'text-green-600' : 'text-gray-600'
                              }`}>
                              One lowercase letter
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordStrength.requirements.hasNumber ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <X size={16} className="text-gray-400" />
                            )}
                            <span className={`text-xs ${passwordStrength.requirements.hasNumber ? 'text-green-600' : 'text-gray-600'
                              }`}>
                              One number
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordStrength.requirements.hasSpecialChar ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <X size={16} className="text-gray-400" />
                            )}
                            <span className={`text-xs ${passwordStrength.requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-600'
                              }`}>
                              One special character (!@#$%^&*)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        step === 1 &&
                        (usernameAvailability.status === "unavailable" ||
                          (usernameAvailability.status === "checking" &&
                            data.username.length > 0))
                      }
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Next Step
                    </button>
                  </div>
                )}

                {/* Step 2: Contact & Institute */}
                {step === 2 && (
                  <div className="space-y-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact & Institute Details</h3>

                    {/* Student Type Selection - At the top of Step 2 */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5 mb-6">
                      <h4 className="text-base font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Select Your Academic Level & Student Type
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="academicLevel" className="form-label">AL or OL <span className="text-red-500">*</span></label>
                          <Select
                            value={data.academicLevel}
                            onValueChange={(value) => setData({ ...data, academicLevel: value })}
                          >
                            <SelectTrigger id="academicLevel" className="w-full !bg-white dark:!bg-gray-800">
                              <SelectValue placeholder="Select AL or OL" />
                            </SelectTrigger>
                            <SelectContent className="!bg-white dark:!bg-gray-800">
                              <SelectItem value="AL" className="!bg-white dark:!bg-gray-800 hover:!bg-gray-100 dark:hover:!bg-gray-700">AL (Advanced Level)</SelectItem>
                              <SelectItem value="OL" className="!bg-white dark:!bg-gray-800 hover:!bg-gray-100 dark:hover:!bg-gray-700">OL (Ordinary Level)</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.academicLevel && <p className="text-red-500 text-xs mt-1">{errors.academicLevel}</p>}
                        </div>
                        <div>
                          <label htmlFor="studentType" className="form-label">Student Type <span className="text-red-500">*</span></label>
                          <Select
                            value={data.studentType}
                            onValueChange={(value) => setData({ ...data, studentType: value as "Physical" | "Online" })}
                          >
                            <SelectTrigger id="studentType" className="w-full !bg-white dark:!bg-gray-800">
                              <SelectValue placeholder="Select Student Type" />
                            </SelectTrigger>
                            <SelectContent className="!bg-white dark:!bg-gray-800">
                              <SelectItem value="Physical" className="!bg-white dark:!bg-gray-800 hover:!bg-gray-100 dark:hover:!bg-gray-700">Physical (In-person)</SelectItem>
                              <SelectItem value="Online" className="!bg-white dark:!bg-gray-800 hover:!bg-gray-100 dark:hover:!bg-gray-700">Online (Remote)</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.studentType && <p className="text-red-500 text-xs mt-1">{errors.studentType}</p>}
                        </div>
                      </div>

                      {/* Institute Selection */}
                      <div className="mt-5">
                        <label htmlFor="institute" className="form-label">Select Institute <span className="text-red-500">*</span></label>
                        {isLoadingInstitutes ? (
                          <div className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 text-center">
                            Loading institutes...
                          </div>
                        ) : instituteError ? (
                          <div className="w-full px-4 py-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center text-sm">
                            {instituteError}
                          </div>
                        ) : (
                          <Select
                            value={data.institute}
                            onValueChange={(value) => setData({ ...data, institute: value })}
                            disabled={isLoadingInstitutes}
                          >
                            <SelectTrigger id="institute" className="w-full !bg-white dark:!bg-gray-800">
                              <SelectValue placeholder="Select an institute" />
                            </SelectTrigger>
                            <SelectContent className="!bg-white dark:!bg-gray-800">
                              {filteredInstitutes.map((inst) => (
                                <SelectItem key={inst._id} value={inst._id} className="!bg-white dark:!bg-gray-800 hover:!bg-gray-100 dark:hover:!bg-gray-700">
                                  {inst.name} - {inst.location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {errors.institute && <p className="text-red-500 text-xs mt-1">{errors.institute}</p>}
                      </div>

                      {/* Year Selection */}
                      <div className="mt-5">
                        <label htmlFor="year" className="form-label">OL/AL Facing Year (Exam Year) <span className="text-red-500">*</span></label>
                        {isLoadingYears ? (
                          <div className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 text-center">
                            Loading years...
                          </div>
                        ) : yearError ? (
                          <div className="w-full px-4 py-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center text-sm">
                            {yearError}
                          </div>
                        ) : (
                          <Select
                            value={data.year}
                            onValueChange={(value) => setData({ ...data, year: value })}
                            disabled={isLoadingYears}
                          >
                            <SelectTrigger id="year" className="w-full !bg-white dark:!bg-gray-800">
                              <SelectValue placeholder="Select your facing year" />
                            </SelectTrigger>
                            <SelectContent className="!bg-white dark:!bg-gray-800">
                              {fetchedYears.map((year) => (
                                <SelectItem key={year._id} value={year._id} className="!bg-white dark:!bg-gray-800 hover:!bg-gray-100 dark:hover:!bg-gray-700">
                                  {year.name || year.year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                      </div>

                      {/* Info message based on selection */}
                      {data.academicLevel && data.studentType && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-emerald-700">Selected:</span> {data.academicLevel} - {data.studentType}
                            {data.institute && (
                              <span className="ml-2">
                                • {filteredInstitutes.find(i => i._id === data.institute)?.name}
                              </span>
                            )}
                            {data.academicLevel === 'AL' && data.studentType === 'Physical' && (
                              <span className="block mt-1 text-blue-600">• ID card will be required in Step 3</span>
                            )}
                            {(data.academicLevel === 'OL' || data.studentType === 'Online') && (
                              <span className="block mt-1 text-green-600">• No ID card required</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="phoneNumber" className="form-label">Phone Number <span className="text-red-500">*</span></label>
                        <input
                          id="phoneNumber"
                          type="tel"
                          className="form-input"
                          value={data.phoneNumber}
                          onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                          placeholder="+94 77 123 4567"
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                      </div>
                      <div>
                        <label htmlFor="whatsappNumber" className="form-label">WhatsApp Number <span className="text-red-500">*</span></label>
                        <input
                          id="whatsappNumber"
                          type="tel"
                          className="form-input"
                          value={data.whatsappNumber}
                          onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })}
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="telegramUsername" className="form-label">Telegram Username</label>
                      <input
                        id="telegramUsername"
                        type="text"
                        className="form-input"
                        value={data.telegram}
                        onChange={(e) => setData({ ...data, telegram: e.target.value })}
                        placeholder="@username"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="form-label">Address</label>
                      <textarea
                        id="address"
                        className="form-input"
                        value={data.address}
                        onChange={(e) => setData({ ...data, address: e.target.value })}
                        placeholder="Your address"
                        rows={3}
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Upload Documents */}

                {step === 3 && (

                  <div className="space-y-5">

                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {data.academicLevel === 'AL' && data.studentType === 'Physical'
                        ? 'Upload Documents'
                        : 'Review Your Information'}
                    </h3>

                    {/* Only show ID card upload for AL Physical students */}
                    {data.academicLevel === 'AL' && data.studentType === 'Physical' && (
                      <>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> ID card upload is required for AL Physical students only.
                          </p>
                        </div>

                        <div>

                          <label htmlFor="idCardFront" className="form-label">ID Card Front <span className="text-red-500">*</span></label>

                          <input
                            id="idCardFront"
                            type="file"

                            className="form-input"

                            onChange={(e) => setData({ ...data, idCardFront: e.target.files?.[0] || null })}

                            accept="image/*"

                          />

                          <p className="text-sm text-gray-500 mt-2">Upload a clear photo of the front side of your ID card</p>

                        </div>



                        <div>

                          <label htmlFor="idCardBack" className="form-label">ID Card Back <span className="text-red-500">*</span></label>

                          <input
                            id="idCardBack"
                            type="file"

                            className="form-input"

                            onChange={(e) => setData({ ...data, idCardBack: e.target.files?.[0] || null })}

                            accept="image/*"

                          />

                          <p className="text-sm text-gray-500 mt-2">Upload a clear photo of the back side of your ID card</p>

                        </div>
                      </>
                    )}

                    {/* Show message for students who don't need ID card */}
                    {(data.academicLevel === 'OL' || data.studentType === 'Online') && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-green-800 mb-2">No ID Card Required</h4>
                        <p className="text-sm text-green-700">
                          {data.academicLevel === 'OL'
                            ? 'ID card upload is not required for OL students.'
                            : 'ID card upload is not required for online students.'}
                        </p>
                      </div>
                    )}



                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-6">
                      <h4 className="font-semibold text-emerald-800 mb-2">Review Your Information</h4>
                      <div className="text-sm text-emerald-700 space-y-1">
                        <p><span className="font-medium">Name:</span> {data.firstName} {data.lastName}</p>
                        <p><span className="font-medium">Email:</span> {data.email}</p>
                        <p><span className="font-medium">Phone:</span> {data.phoneNumber}</p>
                        <p><span className="font-medium">Student Type:</span> {data.studentType}</p>
                      </div>
                    </div>

                    {/* Privacy Policy Checkbox */}
                    <div className="flex items-start gap-3 mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center h-5">
                        <input
                          id="privacy-policy"
                          name="privacy-policy"
                          type="checkbox"
                          checked={isPrivacyAccepted}
                          onChange={(e) => setIsPrivacyAccepted(e.target.checked)}
                          className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                        />
                      </div>
                      <div className="text-sm">
                        <label htmlFor="privacy-policy" className="font-medium text-gray-700 cursor-pointer select-none">
                          I agree to the{" "}
                          <button
                            type="button"
                            onClick={() => setIsPrivacyModalOpen(true)}
                            className="text-emerald-600 hover:text-emerald-700 underline font-semibold focus:outline-none"
                          >
                            Privacy Policy
                          </button>
                          {" "}and Terms of Service
                        </label>
                        <p className="text-gray-500 mt-1 text-xs">
                          By creating an account, you agree to our data collection and usage practices as described in the Privacy Policy.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleRegister}
                        disabled={loading}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {errors.apiError && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-xl text-sm text-center font-medium mt-6">
                  {errors.apiError}
                </div>
              )}

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

        <style jsx global>{`
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

          /* Modern Form Styles */
          .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
          }

          .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 0.95rem;
            line-height: 1.5;
            color: #1f2937;
            background-color: #ffffff;
            border: 1.5px solid #e5e7eb;
            border-radius: 0.75rem;
            transition: all 0.2s ease-in-out;
            outline: none;
          }

          .form-input:hover {
            border-color: #d1d5db;
            background-color: #fafafa;
          }

          .form-input:focus {
            border-color: #10b981;
            background-color: #ffffff;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          }

          .form-input::placeholder {
            color: #9ca3af;
          }

          /* Select Dropdown */
          select.form-input {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 12px;
            padding-right: 2.5rem;
            cursor: pointer;
          }

          select.form-input:focus {
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          }

          /* File Input */
          input[type="file"].form-input {
            padding: 0.625rem;
            font-size: 0.875rem;
          }

          input[type="file"].form-input::file-selector-button {
            padding: 0.5rem 1rem;
            margin-right: 1rem;
            background-color: #f3f4f6;
            border: 1.5px solid #e5e7eb;
            border-radius: 0.5rem;
            color: #374151;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          input[type="file"].form-input::file-selector-button:hover {
            background-color: #e5e7eb;
            border-color: #d1d5db;
          }

          /* Textarea */
          textarea.form-input {
            resize: vertical;
            min-height: 80px;
          }

          /* Disabled State */
          .form-input:disabled {
            background-color: #f9fafb;
            color: #9ca3af;
            cursor: not-allowed;
            opacity: 0.6;
          }
        `}</style>
      </div>
    </>
  );
}