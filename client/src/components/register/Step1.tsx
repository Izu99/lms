
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

  // Debounce username checking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.username) {
        checkUsername(data.username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [data.username, checkUsername]);

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
      if (data.password === data.confirmPassword) {
        if (usernameStatus === 'available' || usernameStatus === 'idle') {
          nextStep();
        }
      } else {
        alert("Passwords do not match");
      }
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
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              value={data.firstName}
              onChange={(e) => setData({ ...data, firstName: e.target.value })}
              className="h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-sm font-medium bg-white/80 transition-all duration-200 placeholder:text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User size={16} className="text-emerald-500" />
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              value={data.lastName}
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              className="h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-sm font-medium bg-white/80 transition-all duration-200 placeholder:text-sm"
              required
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User size={16} className="text-emerald-500" />
            Username
          </label>
          <Input
            id="username"
            name="username"
            placeholder="Choose a username"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            className="h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-sm font-medium bg-white/80 transition-all duration-200"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User size={16} className="text-emerald-500" />
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-sm font-medium bg-white/80 transition-all duration-200"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Lock size={16} className="text-emerald-500" />
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="pr-14 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-sm font-medium bg-white/80 transition-all duration-200"
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

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Lock size={16} className="text-emerald-500" />
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={data.confirmPassword}
              onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
              className="pr-14 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-sm font-medium bg-white/80 transition-all duration-200"
              required
            />
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
        <Button
          type="submit"
          className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-xl transition-all duration-500 transform hover:scale-104 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <span className="relative z-10 flex items-center justify-center gap-2">
            Continue
            <ChevronRight size={20} />
          </span>
        </Button>
      </form>
    </motion.div>
  );
}
