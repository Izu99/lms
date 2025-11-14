"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Building2, GraduationCap, MessageCircle, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface Step2Props {
  data: {
    address: string;
    phoneNumber: string;
    whatsappNumber: string;
    studentType: string;
    institute: string;
  };
  setData: (data: Step2Props['data']) => void;
  nextStep: () => void;
  prevStep: () => void;
  institutes: { _id: string; name: string }[];
}

export default function Step2({ data, setData, nextStep, prevStep, institutes }: Step2Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.address && data.institute && data.studentType) {
      nextStep();
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
        {/* Student Type and Institute */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="studentType" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <GraduationCap size={16} className="text-emerald-500" />
              Student Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={data.studentType}
              onValueChange={(value) => setData({ ...data, studentType: value })}
            >
              <SelectTrigger className="h-14 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200">
                <SelectValue placeholder="Select student type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Physical">Physical</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="institute" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Building2 size={16} className="text-emerald-500" />
              Institute <span className="text-red-500">*</span>
            </label>
            <Select
              value={data.institute}
              onValueChange={(value) => setData({ ...data, institute: value })}
            >
              <SelectTrigger className="h-14 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200">
                <SelectValue placeholder="Select an institute" />
              </SelectTrigger>
              <SelectContent>
                {institutes.map((institute) => (
                  <SelectItem key={institute._id} value={institute._id}>
                    {institute.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Home size={16} className="text-emerald-500" />
            Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="address"
            name="address"
            placeholder="Enter your address"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="h-14 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
            required
          />
        </div>

        {/* Phone Numbers - Two in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Phone size={16} className="text-emerald-500" />
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={data.phoneNumber}
              onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
              className="h-14 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 placeholder:text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="whatsappNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MessageCircle size={16} className="text-emerald-500" />
              WhatsApp Number <span className="text-gray-400">(Optional)</span>
            </label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              placeholder="Enter your WhatsApp number"
              value={data.whatsappNumber}
              onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })}
              className="h-14 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl text-sm font-medium bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 placeholder:text-sm"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            type="button"
            onClick={prevStep}
            className="flex items-center justify-center w-14 h-14 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            type="submit"
            className="w-14 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-xl transition-all duration-500 transform hover:scale-104 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
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