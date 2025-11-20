"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Eye, EyeOff, ChevronRight, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "@/lib/constants";

interface Step1Props {
  data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  setData: (data: Step1Props['data']) => void;
  nextStep: () => void;
}

export default function Step1({ data, setData, nextStep }: Step1Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameError, setUsernameError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'none' | 'weak' | 'medium' | 'strong'>('none');
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // Debounced username validation
  const checkUsername = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus('idle');
      setUsernameError('');
      return;
    }

    setUsernameStatus('checking');
    try {
      const response = await axios.post(`${API_URL}/auth/check-username`, { username });
      if (response.data.available) {
        setUsernameStatus('available');
        setUsernameError('');
      } else {
        setUsernameStatus('taken');
        setUsernameError('Username is already taken');
      }
    } catch (error) {
      setUsernameStatus('idle');
      setUsernameError('Error checking username');
    }
  }, []);

  const checkPasswordStrength = useCallback((password: string) => {
    let strength: 'none' | 'weak' | 'medium' | 'strong' = 'none';
    if (password.length === 0) {
      strength = 'none';
    } else if (password.length < 6) {
      strength = 'weak';
    } else {
      const hasLowercase = /[a-z]/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

      if (password.length >= 8 && hasLowercase && hasUppercase && hasNumber && hasSymbol) {
        strength = 'strong';
      } else if (password.length >= 6 && (hasLowercase || hasUppercase) && hasNumber) {
        strength = 'medium';
      } else {
        strength = 'weak';
      }
    }
    setPasswordStrength(strength);
  }, []);

  // Debounce username checking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.username) {
        checkUsername(data.username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [data.username, checkUsername]);

  // Password strength and match checking
  useEffect(() => {
    checkPasswordStrength(data.password);
    setPasswordsMatch(data.password === data.confirmPassword && data.confirmPassword.length > 0);
  }, [data.password, data.confirmPassword, checkPasswordStrength]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if username is available
    if (usernameStatus === 'taken') {
      setUsernameError('Please choose a different username');
      return;
    }
    
    if (usernameStatus === 'checking') {
      setUsernameError('Please wait while we check username availability');
      return;
    }
    
    if (data.firstName && data.lastName && data.username && data.email && data.password && data.confirmPassword) {
      if (passwordsMatch) {
        if (usernameStatus === 'available' || usernameStatus === 'idle') {
          if (passwordStrength === 'strong' || passwordStrength === 'medium') {
            nextStep();
          } else {
            alert("Password is too weak");
          }
        } else if (usernameStatus === 'taken') {
          setUsernameError('Please choose a different username');
        } else if (usernameStatus === 'checking') {
          setUsernameError('Please wait while we check username availability');
        }
      } else {
        alert("Passwords do not match");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit} className="space-y-6" role="form">
        {/* Name Fields - Two in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User size={16} className="text-emerald-500" />
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              value={data.firstName}
              onChange={(e) => setData({ ...data, firstName: e.target.value })}
              className="h-12 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 placeholder:text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User size={16} className="text-emerald-500" />
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              value={data.lastName}
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              className="h-12 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 placeholder:text-sm"
              required
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User size={16} className="text-emerald-500" />
            Username <span className="text-red-500">*</span>
          </label>
          <Input
            id="username"
            name="username"
            placeholder="Choose a username"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            className="h-12 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
            required
          />
          <div className="mt-1 text-sm flex items-center gap-2">
            {usernameStatus === 'checking' && (
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            )}
            {usernameStatus === 'available' && (
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            )}
            {usernameStatus === 'taken' && (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            {usernameError && (
              <span className="text-red-500">{usernameError}</span>
            )}
            {usernameStatus === 'available' && !usernameError && (
              <span className="text-emerald-500">Username is available</span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User size={16} className="text-emerald-500" />
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="h-12 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Lock size={16} className="text-emerald-500" />
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="pr-14 h-12 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
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
          <div className="mt-1 flex items-center gap-2 text-sm">
            {passwordStrength === 'weak' && <span className="text-red-500">Weak</span>}
            {passwordStrength === 'medium' && <span className="text-orange-500">Medium</span>}
            {passwordStrength === 'strong' && <span className="text-emerald-500">Strong</span>}
            {passwordStrength !== 'none' && (
              <div className={`h-2 rounded-full flex-grow ${passwordStrength === 'weak' ? 'bg-red-500 w-1/3' : passwordStrength === 'medium' ? 'bg-orange-500 w-2/3' : 'bg-emerald-500 w-full'}`}></div>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Lock size={16} className="text-emerald-500" />
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={data.confirmPassword}
              onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
              className="pr-14 h-12 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
              required
            />
            {data.confirmPassword.length > 0 && (
              <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
                {passwordsMatch ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="h-12 w-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-xl transition-all duration-500 transform hover:scale-104 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              <ChevronRight size={20} />
            </span>
          </Button>
        </div>
      </form>
    </motion.div>
  );
}