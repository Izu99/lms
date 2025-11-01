
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Home, Building, MapPin, ArrowLeft } from "lucide-react";

export default function Step2({ data, setData, nextStep, prevStep }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Home size={16} className="text-emerald-500" />
          Address (Optional)
        </label>
        <Input
          name="address"
          placeholder="Enter your address"
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          className="pl-12 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-lg font-medium bg-white/80 transition-all duration-200"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Building size={16} className="text-emerald-500" />
          Institute
        </label>
        <Input
          name="institute"
          placeholder="Enter your institute"
          value={data.institute}
          onChange={(e) => setData({ ...data, institute: e.target.value })}
          className="pl-12 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-lg font-medium bg-white/80 transition-all duration-200"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <MapPin size={16} className="text-emerald-500" />
          District
        </label>
        <Input
          name="district"
          placeholder="Enter your district"
          value={data.district}
          onChange={(e) => setData({ ...data, district: e.target.value })}
          className="pl-12 h-14 border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 rounded-xl text-lg font-medium bg-white/80 transition-all duration-200"
          required
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
          onClick={nextStep}
          className="h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
