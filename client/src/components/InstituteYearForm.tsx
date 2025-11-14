"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, School, MapPin, Users, Calendar } from "lucide-react";
import { InfoDialog } from "@/components/InfoDialog";

interface InstituteData {
  _id: string;
  name: string;
  location: string;
  isActive: boolean;
}

interface YearData {
  _id: string;
  year: string;
  name: string;
  isActive: boolean;
}

interface InstituteYearFormProps {
  instituteData?: InstituteData | null;
  yearData?: YearData | null;
  onSaveInstitute: (formData: { name: string; location: string }) => void;
  onSaveYear: (formData: { year: string; name: string }) => void;
  onClose: () => void;
  mode: "institute" | "year";
}

export default function InstituteYearForm({ instituteData, yearData, onSaveInstitute, onSaveYear, onClose, mode }: InstituteYearFormProps) {
  const [instituteFormData, setInstituteFormData] = useState({
    name: "",
    location: ""
  });
  const [yearFormData, setYearFormData] = useState({
    year: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState({ title: "", description: "" });

  useEffect(() => {
    if (mode === "institute") {
      setInstituteFormData({
        name: instituteData?.name || "",
        location: instituteData?.location || ""
      });
    } else if (mode === "year") {
      setYearFormData({
        year: yearData?.year || "",
        name: yearData?.name || ""
      });
    }
  }, [instituteData, yearData, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      if (mode === "institute") {
        if (!instituteFormData.name.trim() || !instituteFormData.location.trim()) {
          setInfoDialogContent({ title: "Validation Error", description: "Please fill in all required fields for Institute" });
          setIsInfoOpen(true);
          setLoading(false);
          return;
        }
        await onSaveInstitute(instituteFormData);
      } else if (mode === "year") {
        if (!yearFormData.year.trim() || !yearFormData.name.trim()) {
          setInfoDialogContent({ title: "Validation Error", description: "Please fill in all required fields for Year" });
          setIsInfoOpen(true);
          setLoading(false);
          return;
        }
        await onSaveYear(yearFormData);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card-bg)] rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              {mode === "institute" ? (
                <School className="text-blue-600 dark:text-blue-400" size={20} />
              ) : (
                <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
              )}
            </div>
            <h2 className="text-xl font-semibold text-[var(--theme-text-primary)]">
              {mode === "institute"
                ? instituteData
                  ? "Edit Institute"
                  : "Add New Institute"
                : yearData
                ? "Edit Year"
                : "Add New Year"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {mode === "institute" ? (
            <>
              {/* Institute Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
                  Institute Name *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--theme-text-tertiary)]" size={18} />
                  <Input
                    value={instituteFormData.name}
                    onChange={(e) => setInstituteFormData({ ...instituteFormData, name: e.target.value })}
                    placeholder="e.g., ezyICT, TechVision"
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-[var(--theme-text-tertiary)] mt-1">
                  Enter the institute identifier (e.g., ezyICT)
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--theme-text-tertiary)]" size={18} />
                  <Input
                    value={instituteFormData.location}
                    onChange={(e) => setInstituteFormData({ ...instituteFormData, location: e.target.value })}
                    placeholder="e.g., Tangalle, Matara, Colombo"
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-[var(--theme-text-tertiary)] mt-1">
                  Enter the branch or location name
                </p>
              </div>

              {/* Preview */}
              {instituteFormData.name && instituteFormData.location && (
                <div className="border-t border-[var(--theme-border)] pt-6">
                  <h3 className="text-sm font-medium text-[var(--theme-text-secondary)] mb-3">Preview</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                        <Users className="text-blue-600 dark:text-blue-400" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[var(--theme-text-primary)]">{instituteFormData.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-[var(--theme-text-secondary)]">
                          <MapPin size={14} />
                          <span>{instituteFormData.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Year Number */}
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text-secondary)] mb-2">
                  Academic Year *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--theme-text-tertiary)]" size={18} />
                  <Input
                    type="text"
                    value={yearFormData.year}
                    onChange={(e) => setYearFormData({ ...yearFormData, year: e.target.value, name: e.target.value })}
                    placeholder="e.g., 2024-2025"
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-[var(--theme-text-tertiary)] mt-1">
                  Enter the academic year range (e.g., 2024-2025)
                </p>
              </div>

              {/* Preview */}
              {yearFormData.year && (
                <div className="border-t border-[var(--theme-border)] pt-6">
                  <h3 className="text-sm font-medium text-[var(--theme-text-secondary)] mb-3">Preview</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                        <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[var(--theme-text-primary)]">{yearFormData.year}</h4>
                        <div className="flex items-center gap-1 text-sm text-[var(--theme-text-secondary)]">
                          <School size={14} />
                          <span>Academic Year: {yearFormData.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-[var(--theme-border)]">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white dark:border-gray-800 border-t-transparent rounded-full animate-spin" />
                  {mode === "institute"
                    ? instituteData
                      ? "Updating Institute..."
                      : "Creating Institute..."
                    : yearData
                    ? "Updating Year..."
                    : "Creating Year..."}
                </div>
              ) : (
                mode === "institute"
                  ? instituteData
                    ? "Update Institute"
                    : "Create Institute"
                  : yearData
                  ? "Update Year"
                  : "Create Year"
              )}
            </Button>
          </div>
        </form>
        <InfoDialog
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
          title={infoDialogContent.title}
          description={infoDialogContent.description}
        />
      </div>
    </div>
  );
}