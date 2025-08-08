"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, School, MapPin, Users } from "lucide-react";

interface ClassData {
  _id: string;
  name: string;
  location: string;
  isActive: boolean;
}

interface ClassFormProps {
  classData?: ClassData | null;
  onSave: (formData: { name: string; location: string }) => void;
  onClose: () => void;
}

export default function ClassForm({ classData, onSave, onClose }: ClassFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name,
        location: classData.location
      });
    }
  }, [classData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.location.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving class:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <School className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {classData ? "Edit Class" : "Add New Class"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Class Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Name *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., A1, A2, Science A"
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the class identifier (A1, A2, etc.)
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Tangalle, Matara, Colombo"
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the branch or location name
            </p>
          </div>

          {/* Preview */}
          {formData.name && formData.location && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{formData.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span>{formData.location}</span>
                    </div>
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
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {classData ? "Updating..." : "Creating..."}
                </div>
              ) : (
                classData ? "Update Class" : "Create Class"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
