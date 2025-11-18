import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CoursePackageData } from "@/modules/shared/types/course-package.types";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { CoursePackageService } from "@/modules/teacher/services/coursePackageService";
import { Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchableMultiSelectProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  isLoading?: boolean; // Add isLoading prop
}

export function SearchableMultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Choose options...",
  isLoading = false, // Default to false
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search
  useEffect(() => {
    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Toggle item selection
  function toggleOption(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  function renderButtonText() {
    if (isLoading && selected.length > 0) {
      return <span className="text-gray-400">Loading selected items...</span>;
    }
    if (selected.length === 0) {
      return <span className="text-gray-400">{placeholder}</span>;
    } else if (selected.length === 1) {
      const label = options.find((o) => o.value === selected[0])?.label || "";
      return <span>{label.length > 20 ? label.slice(0, 20) + "..." : label}</span>;
    } else {
      return <span>{selected.length} items selected</span>;
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-3 py-2 focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={isLoading} // Disable button when loading
      >
        {renderButtonText()}
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-indigo-500 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white"
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul tabIndex={-1} role="listbox" aria-multiselectable="true" className="max-h-48 overflow-auto">
            {filteredOptions.length === 0 && (
              <li className="p-3 text-gray-500 text-center">No matching options found</li>
            )}
            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                className="flex items-start px-4 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-600"
                onClick={() => toggleOption(opt.value)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggleOption(opt.value)}
                  className="mr-2 mt-1 cursor-pointer accent-indigo-600 dark:accent-indigo-400"
                />
                <span className="select-none">{opt.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-wrap gap-2">
          {selected.map((val) => {
            const label = options.find((o) => o.value === val)?.label || val;
            return (
              <span
                key={val}
                className="bg-indigo-600 text-white rounded-full px-3 py-1 text-sm flex items-center gap-2 max-w-[250px] truncate"
                title={label}
              >
                {label}
                <button
                  type="button"
                  onClick={() => toggleOption(val)}
                  className="ml-1 text-white hover:opacity-80 focus:outline-none"
                  aria-label={`Remove ${label}`}
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}


interface Video {
  _id: string;
  title: string;
}

interface Paper {
  _id: string;
  title: string;
}

interface CoursePackageFormProps {
  initialData?: CoursePackageData;
  onSuccess: () => void;
  onCancel: () => void;
}

interface InstituteData {
  _id: string;
  name: string;
  location: string;
  isActive: boolean;
}

interface YearData {
  _id: string;
  year: number;
  name: string;
  isActive: boolean;
}

export function CoursePackageForm({ initialData, onSuccess, onCancel }: CoursePackageFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    videos: [],
    papers: [],
    availability: "all",
    instituteId: "",
    yearId: "",
  });

  const [availableVideos, setAvailableVideos] = useState<Video[]>([]);
  const [availablePapers, setAvailablePapers] = useState<Paper[]>([]);
  const [institutes, setInstitutes] = useState<InstituteData[]>([]);
  const [years, setYears] = useState<YearData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialData && !loading) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        videos: initialData.videos?.map(v => (typeof v === 'string' ? v : v._id)) || [],
        papers: initialData.papers?.map(p => (typeof p === 'string' ? p : p._id)) || [],
        availability: initialData.availability || "all",
        instituteId: initialData.institute?._id || "",
        yearId: initialData.year?._id || "",
      });
    }
  }, [initialData, loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videosRes, papersRes, institutesRes, yearsRes] = await Promise.all([
          api.get<{ videos: Video[] }>('/videos'),
          api.get<{ papers: Paper[] }>('/papers'),
          api.get<{ institutes: InstituteData[] }>('/institutes'),
          api.get<{ years: YearData[] }>('/years')
        ]);
        setAvailableVideos(videosRes.data.videos || []);
        setAvailablePapers(papersRes.data.papers || []);
        setInstitutes(institutesRes.data.institutes || []);
        setYears(yearsRes.data.years || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a package title");
      return;
    }

    if (formData.videos.length === 0 && formData.papers.length === 0) {
      toast.error("Please select at least one video or paper");
      return;
    }

    try {
      const packageData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        videos: formData.videos,
        papers: formData.papers,
        availability: formData.availability,
        institute: formData.instituteId,
        year: formData.yearId,
      };

      if (initialData?._id) {
        await CoursePackageService.updateCoursePackage(initialData._id, packageData);
        toast.success("Course package updated successfully!");
      } else {
        await CoursePackageService.createCoursePackage(packageData);
        toast.success("Course package created successfully!");
      }
      
      onSuccess();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to save course package";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 theme-text-primary">Package Title *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Complete Mathematics Course"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 theme-text-primary">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what's included in this package..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 theme-text-primary">Price (LKR) *</label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          required
        />
      </div>

      {/* Institute Selection */}
      <div>
        <label className="block text-sm font-medium mb-2 theme-text-primary">
          Institute *
        </label>
        <Select
          value={formData.instituteId}
          onValueChange={(value) => setFormData({ ...formData, instituteId: value })}
          disabled={loading}
          required
        >
          <SelectTrigger className="w-full pl-3 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <SelectValue placeholder={loading ? "Loading institutes..." : "Select an institute"} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            {institutes.map(instituteItem => (
              <SelectItem key={instituteItem._id} value={instituteItem._id} className="text-gray-900 dark:text-white">
                {instituteItem.name} - {instituteItem.location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {institutes.length === 0 && !loading && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            No institutes available.
          </p>
        )}
      </div>

      {/* Year Selection */}
      <div>
        <label className="block text-sm font-medium mb-2 theme-text-primary">
          Academic Year *
        </label>
        <Select
          value={formData.yearId}
          onValueChange={(value) => setFormData({ ...formData, yearId: value })}
          disabled={loading}
          required
        >
          <SelectTrigger className="w-full pl-3 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <SelectValue placeholder={loading ? "Loading years..." : "Select a year"} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            {years.map(yearItem => (
              <SelectItem key={yearItem._id} value={yearItem._id} className="text-gray-900 dark:text-white">
                {yearItem.name} (A-Level Year {yearItem.year})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {years.length === 0 && !loading && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            No years available.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 theme-text-primary">Select Videos</label>
        <SearchableMultiSelect
          options={availableVideos.map(v => ({ label: v.title, value: v._id }))}
          selected={formData.videos}
          onChange={(selected) => setFormData({ ...formData, videos: selected })}
          placeholder={loading ? "Loading videos..." : "Choose videos..."}
          isLoading={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 theme-text-primary">Select Papers</label>
        <SearchableMultiSelect
          options={availablePapers.map(p => ({ label: p.title, value: p._id }))}
          selected={formData.papers}
          onChange={(selected) => setFormData({ ...formData, papers: selected })}
          placeholder={loading ? "Loading papers..." : "Choose papers..."}
          isLoading={loading}
        />
      </div>

      {/* Availability Selection */}
      <div>
        <label className="block text-sm font-medium mb-2 theme-text-primary">
          Availability *
        </label>
        <Select
          value={formData.availability}
          onValueChange={(value: "all" | "physical") => setFormData({ ...formData, availability: value })}
          required
          disabled={loading}
        >
          <SelectTrigger className="w-full pl-3 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <SelectValue placeholder={loading ? "Loading availability..." : "Select availability"} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <SelectItem value="all" className="text-gray-900 dark:text-white">
              Free for all students in institute/year
            </SelectItem>
            <SelectItem value="physical" className="text-gray-900 dark:text-white">
              Free for physical students only
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {initialData ? "Update Package" : "Create Package"}
        </Button>
      </div>
    </form>
  );
}
