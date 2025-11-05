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
    institute: string;
    year: string;
    phoneNumber: string;
    whatsappNumber: string;
  };
  setData: (data: Step2Props['data']) => void;
  nextStep: () => void;
  prevStep: () => void;
}

interface Institute {
  _id: string;
  name: string;
  location: string;
}

interface Year {
  _id: string;
  name: string;
  year: number;
}

export default function Step2({ data, setData, nextStep, prevStep }: Step2Props) {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [institutesResponse, yearsResponse] = await Promise.all([
          axios.get(`${API_URL}/institutes`),
          axios.get(`${API_URL}/years`)
        ]);
        setInstitutes(institutesResponse.data.institutes);
        setYears(yearsResponse.data.years);
      } catch (error) {
        console.error("Failed to fetch institutes or years", error);
        // Handle error, maybe show a message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.address && data.institute && data.year) {
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
        {/* Address */}
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Home size={16} className="text-emerald-500" />
            Address
          </label>
          <Input
            id="address"
            name="address"
            placeholder="Enter your address"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-sm font-medium bg-white/80 transition-all duration-200"
            required
          />
        </div>

        {/* Institute */}
        <div className="space-y-2">
          <label htmlFor="institute" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Building2 size={16} className="text-emerald-500" />
            Institute
          </label>
          <Select onValueChange={(value) => setData({ ...data, institute: value })} value={data.institute} required>
            <SelectTrigger id="institute" className="w-full h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-sm font-medium bg-white/80 transition-all duration-200">
              <SelectValue placeholder="Select an institute" className="text-sm" />
            </SelectTrigger>
            <SelectContent className="text-sm">
              {loading ? (
                <SelectItem value="loading" disabled className="text-sm">Loading...</SelectItem>
              ) : (
                institutes.map((institute) => (
                  <SelectItem key={institute._id} value={institute._id} className="text-sm">
                    {institute.name} - {institute.location}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Year */}
        <div className="space-y-2">
          <label htmlFor="year" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <GraduationCap size={16} className="text-emerald-500" />
            Year
          </label>
          <Select onValueChange={(value) => setData({ ...data, year: value })} value={data.year} required>
            <SelectTrigger id="year" className="w-full h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-sm font-medium bg-white/80 transition-all duration-200">
              <SelectValue placeholder="Select a year" className="text-sm" />
            </SelectTrigger>
            <SelectContent className="text-sm">
              {loading ? (
                <SelectItem value="loading" disabled className="text-sm">Loading...</SelectItem>
              ) : (
                years.map((year) => (
                  <SelectItem key={year._id} value={year._id} className="text-sm">
                    {year.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Phone Numbers - Two in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Phone size={16} className="text-emerald-500" />
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={data.phoneNumber}
              onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
              className="h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-sm font-medium bg-white/80 transition-all duration-200 placeholder:text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="whatsappNumber" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MessageCircle size={16} className="text-emerald-500" />
              WhatsApp Number
            </label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              placeholder="Enter your WhatsApp number"
              value={data.whatsappNumber}
              onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })}
              className="h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-sm font-medium bg-white/80 transition-all duration-200 placeholder:text-sm"
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
            className="flex-1 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-xl transition-all duration-500 transform hover:scale-104 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              Continue
              <ChevronRight size={20} />
            </span>
          </Button>
        </div>
      </form>
    </motion.div>
  );
}