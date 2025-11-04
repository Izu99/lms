
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, ArrowLeft } from "lucide-react";

export default function Step3({ data, setData, prevStep, handleSubmit, loading }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Phone size={16} className="text-emerald-500" />
          Phone Number
        </label>
        <Input
          name="phoneNumber"
          placeholder="Enter your phone number"
          value={data.phoneNumber}
          onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
          className="pl-12 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-lg font-medium bg-white/80 transition-all duration-200"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <MessageSquare size={16} className="text-emerald-500" />
          WhatsApp Number
        </label>
        <Input
          name="whatsappNumber"
          placeholder="Enter your WhatsApp number"
          value={data.whatsappNumber}
          onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })}
          className="pl-12 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-lg font-medium bg-white/80 transition-all duration-200"
        />
      </div>
      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          className="h-14 bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          <ArrowLeft />
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating account...</span>
            </div>
          ) : (
            <span className="relative z-10">Create Account</span>
          )}
        </Button>
      </div>
    </div>
  );
}
