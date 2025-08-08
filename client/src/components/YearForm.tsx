"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Calendar, GraduationCap, Hash } from "lucide-react";

interface YearData {
  _id: string;
  year: number;
  name: string;
  isActive: boolean;
}

interface YearFormProps {
  yearData?: YearData | null;
  onSave: (formData: { year: number; name: string }) => void;
  onClose: () => void;
}

export default function YearForm({ yearData, onSave, onClose }: YearFormProps) {
  const [formData, setFormData] = useState({
    year: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (yearData) {
      setFormData({
        year: yearData.year.toString(),
        name: yearData.name
      });
    }
  }, [yearData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const yearNum = parseInt(formData.year);
    if (!formData.year.trim() || !formData.name.trim() || isNaN(yearNum)) {
      alert("Please fill in all required fields with valid values");
      return;
    }

    if (yearNum < 1 || yearNum > 20) {
      alert("Please enter a valid year between 1 and 20");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        year: yearNum,
        name: formData.name
      });
    } catch (error) {
      console.error("Error saving year:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (value: string) => {
    const yearNum = parseInt(value) || 0;
    setFormData({ 
      year: value,
      name: yearNum > 0 ? `Year ${yearNum}` : ""
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {yearData ? "Edit Academic Year" : "Add New Academic Year"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Year Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year Level *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => handleYearChange(e.target.value)}
                placeholder="e.g., 12, 13"
                className="pl-10"
                min="1"
                max="20"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the A-Level year (typically 12 or 13)
            </p>
          </div>

          {/* Year Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name *
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Year 12, Year 13"
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This name will be displayed in dropdowns and lists
            </p>
          </div>

          {/* A-Level Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">A-Level Information</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Year 12: First year of A-Level studies</p>
              <p>• Year 13: Final year with examinations</p>
              <p>• ICT A-Level spans both years</p>
            </div>
          </div>

          {/* Preview */}
          {formData.name && formData.year && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">{formData.year}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{formData.name}</h4>
                    <p className="text-sm text-gray-600">A-Level Year {formData.year}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {yearData ? "Updating..." : "Creating..."}
                </div>
              ) : (
                yearData ? "Update Year" : "Create Year"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
