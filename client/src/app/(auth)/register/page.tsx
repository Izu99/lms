"use client";
import { useState, useEffect, useRef } from "react";
import useDebounce from "@/hooks/useDebounce"; // Import the useDebounce hook
import axios from "axios";
import {
  GraduationCap,
  Quote,
  Star,
  BookOpen,
  Target,
  UserPlus,
  Eye,
  EyeOff,
  Search,
  X,
} from "lucide-react";

interface Institute {
  _id: string;
  name: string;
  location: string;
  isActive: boolean;
}

// Searchable Select Component
interface SearchableSelectProps {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function SearchableSelect({
  options,
  selected,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === selected);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex justify-between items-center px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border-2 border-emerald-500 rounded-xl shadow-xl max-h-64 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <ul className="max-h-48 overflow-auto">
            {filteredOptions.length === 0 && (
              <li className="p-4 text-gray-500 text-center text-sm">No options found</li>
            )}
            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                className={`px-4 py-3 cursor-pointer hover:bg-emerald-50 transition-colors ${
                  selected === opt.value ? "bg-emerald-100 font-medium" : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                <span className="text-sm text-gray-900">{opt.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

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
  academicLevel: string; // Add academicLevel to the interface
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
    studentType: "Physical",
    institute: "",
    academicLevel: "", // Initialize academicLevel
  });
  const [fetchedInstitutes, setFetchedInstitutes] = useState<Institute[]>([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState<Institute[]>([]);
  const [isLoadingInstitutes, setIsLoadingInstitutes] = useState(false);
  const [instituteError, setInstituteError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameAvailability, setUsernameAvailability] = useState<{
    status: "idle" | "checking" | "available" | "unavailable";
    message: string;
  }>({ status: "idle", message: "" });
  const [mounted, setMounted] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [floatingElements, setFloatingElements] = useState<React.CSSProperties[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Debounce the username input
  const debouncedUsername = useDebounce(data.username, 500);

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
      const response = await axios.post("/api/auth/check-username", { username });
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
      const response = await axios.get("/api/institutes");
      setFetchedInstitutes(response.data.institutes);
    } catch (error) {
      console.error("Error fetching institutes:", error);
      setInstituteError("Failed to load institutes. Please try again.");
    } finally {
      setIsLoadingInstitutes(false);
    }
  };

  // Effect to fetch institutes on component mount
  useEffect(() => {
    fetchInstitutes();
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
    if (step === 1) {
      if (!data.firstName || !data.lastName || !data.username || !data.password || !data.confirmPassword) {
        setError("Please fill in all required fields");
        return;
      }
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setError(null);
      setStep((prev) => prev + 1);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate registration
    setTimeout(() => {
      alert("Registration successful! (Demo mode)");
      setLoading(false);
    }, 1500);
  };

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
                <h1 className="text-3xl font-bold text-gray-900">ezyICT</h1>
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
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={data.firstName}
                        onChange={(e) => setData({ ...data, firstName: e.target.value })}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={data.lastName}
                        onChange={(e) => setData({ ...data, lastName: e.target.value })}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Username *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={data.username}
                      onChange={(e) => setData({ ...data, username: e.target.value })}
                      placeholder="Choose a username"
                    />
                    {usernameAvailability.status !== "idle" && (
                      <p
                        className={`text-sm mt-2 ${
                          usernameAvailability.status === "available"
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
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Password *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-input pr-10" // Add padding to the right for the icon
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
                    </div>
                    <div>
                      <label className="form-label">Confirm Password *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-input pr-10" // Add padding to the right for the icon
                          value={data.confirmPassword}
                          onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                          placeholder="Confirm password"
                        />
                        <span
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                      </div>
                    </div>
                  </div>

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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={data.phoneNumber}
                        onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                        placeholder="+94 77 123 4567"
                      />
                    </div>
                    <div>
                      <label className="form-label">WhatsApp Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={data.whatsappNumber}
                        onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })}
                        placeholder="+94 77 123 4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Telegram Username</label>
                    <input
                      type="text"
                      className="form-input"
                      value={data.telegram}
                      onChange={(e) => setData({ ...data, telegram: e.target.value })}
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-input"
                      value={data.address}
                      onChange={(e) => setData({ ...data, address: e.target.value })}
                      placeholder="Your address"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">AL or OL *</label>
                      <select
                        className="form-input"
                        value={data.academicLevel}
                        onChange={(e) => setData({ ...data, academicLevel: e.target.value })}
                      >
                        <option value="">Select AL or OL</option>
                        <option value="AL">AL</option>
                        <option value="OL">OL</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Student Type *</label>
                      <select
                        className="form-input"
                        value={data.studentType}
                        onChange={(e) => setData({ ...data, studentType: e.target.value as "Physical" | "Online" })}
                      >
                        <option value="Physical">Physical</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Select Institute *</label>
                    {isLoadingInstitutes ? (
                      <div className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 text-center">
                        Loading institutes...
                      </div>
                    ) : instituteError ? (
                      <div className="w-full px-4 py-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center text-sm">
                        {instituteError}
                      </div>
                    ) : (
                      <SearchableSelect
                        options={filteredInstitutes.map((inst) => ({
                          label: `${inst.name} - ${inst.location}`,
                          value: inst._id,
                        }))}
                        selected={data.institute}
                        onChange={(value) => setData({ ...data, institute: value })}
                        placeholder="Select an institute"
                        disabled={isLoadingInstitutes}
                      />
                    )}
                  </div>

                  <div className="flex gap-3">
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents</h3>
                  
                  <div>
                    <label className="form-label">ID Card Front *</label>
                    <input
                      type="file"
                      className="form-input"
                      onChange={(e) => setData({ ...data, idCardFront: e.target.files?.[0] || null })}
                      accept="image/*"
                    />
                    <p className="text-sm text-gray-500 mt-2">Upload a clear photo of the front side of your ID card</p>
                  </div>

                  <div>
                    <label className="form-label">ID Card Back *</label>
                    <input
                      type="file"
                      className="form-input"
                      onChange={(e) => setData({ ...data, idCardBack: e.target.files?.[0] || null })}
                      accept="image/*"
                    />
                    <p className="text-sm text-gray-500 mt-2">Upload a clear photo of the back side of your ID card</p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-6">
                    <h4 className="font-semibold text-emerald-800 mb-2">Review Your Information</h4>
                    <div className="text-sm text-emerald-700 space-y-1">
                      <p><span className="font-medium">Name:</span> {data.firstName} {data.lastName}</p>
                      <p><span className="font-medium">Email:</span> {data.email}</p>
                      <p><span className="font-medium">Phone:</span> {data.phoneNumber}</p>
                      <p><span className="font-medium">Student Type:</span> {data.studentType}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
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

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-xl text-sm text-center font-medium">
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
                <a
                  href="/login"
                  className="relative text-emerald-600 hover:text-teal-700 font-semibold text-lg transition-colors duration-300 group inline-block"
                >
                  Sign In Instead
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:w-full transition-all duration-300"></span>
                </a>
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
  );
}