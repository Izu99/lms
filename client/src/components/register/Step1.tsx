
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Step1({ data, setData, nextStep }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <User size={16} className="text-emerald-500" />
          First Name
        </label>
        <Input
          name="firstName"
          placeholder="Enter your first name"
          value={data.firstName}
          onChange={(e) => setData({ ...data, firstName: e.target.value })}
          className="pl-12 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-lg font-medium bg-white/80 transition-all duration-200"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <User size={16} className="text-emerald-500" />
          Last Name
        </label>
        <Input
          name="lastName"
          placeholder="Enter your last name"
          value={data.lastName}
          onChange={(e) => setData({ ...data, lastName: e.target.value })}
          className="pl-12 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-lg font-medium bg-white/80 transition-all duration-200"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <User size={16} className="text-emerald-500" />
          Username
        </label>
        <div className="relative group">
          <User
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200"
            size={20}
          />
          <Input
            name="username"
            placeholder="Choose a username"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            className="pl-12 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-lg font-medium bg-white/80 transition-all duration-200"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Lock size={16} className="text-emerald-500" />
          Password
        </label>
        <div className="relative group">
          <Lock
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200"
            size={20}
          />
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="pl-12 pr-14 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-lg font-medium bg-white/80 transition-all duration-200"
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
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Lock size={16} className="text-emerald-500" />
          Confirm Password
        </label>
        <div className="relative group">
          <Lock
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200"
            size={20}
          />
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={data.confirmPassword}
            onChange={(e) =>
              setData({ ...data, confirmPassword: e.target.value })
            }
            className="pl-12 pr-14 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-lg font-medium bg-white/80 transition-all duration-200"
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
      <Button
        onClick={nextStep}
        className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      >
        Next
      </Button>
    </div>
  );
}
