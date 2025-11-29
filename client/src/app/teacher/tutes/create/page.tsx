"use client";

import { useState, useEffect } from "react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ArrowLeft, Upload, School, Calendar, GraduationCap, X } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { toast } from "sonner";

export default function CreateTutePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("all");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [institutes, setInstitutes] = useState<{ _id: string, name: string, location?: string }[]>([]);
  const [years, setYears] = useState<{ _id: string, year: string, name: string }[]>([]);
  const [instituteId, setInstituteId] = useState("");
  const [yearId, setYearId] = useState("");
  const [academicLevelId, setAcademicLevelId] = useState("");

  // Hardcoded academic levels
  const academicLevels = [
    { _id: "OL", name: "Ordinary Level" },
    { _id: "AL", name: "Advanced Level" }
  ];
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        const [instituteRes, yearRes] = await Promise.all([
          axios.get(`${API_URL}/institutes`, { headers }),
          axios.get(`${API_URL}/years`, { headers })
        ]);
        setInstitutes(instituteRes.data.institutes || []);
        setYears(yearRes.data.years || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load institutes and years.");
      } finally {
        setDataLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!instituteId) {
      toast.error("Institute is required");
      return;
    }
    if (!yearId) {
      toast.error("Year is required");
      return;
    }
    if (!academicLevelId) {
      toast.error("Academic Level is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("availability", availability);
    formData.append("price", price.toString());
    formData.append("institute", instituteId);
    formData.append("year", yearId);
    formData.append("academicLevel", academicLevelId);

    if (file) {
      formData.append("file", file);
    }
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/tutes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Tute created successfully!");
      router.push("/teacher/tutes");
    } catch (error: any) {
      console.error("Error creating tute:", error);
      toast.error(error.response?.data?.message || "Failed to create tute");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Create New Tute</h1>
              <p className="text-muted-foreground text-lg">Upload PDF or PowerPoint tutorial</p>
            </div>
          </div>
          <Button variant="outline" size="lg" onClick={() => router.push("/teacher/tutes")}>
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-8 theme-card text-gray-900 dark:text-white rounded-2xl shadow-lg p-8">
          {/* Title */}
          <div>
            <label className="font-semibold text-foreground mb-3 block text-lg">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., Introduction to Python Programming"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-14 text-lg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-foreground mb-3 block text-lg">Description (Optional)</label>
            <Textarea
              placeholder="Brief description of the tutorial content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] text-lg"
            />
          </div>

          {/* Institute, Year, and Academic Level Selection - in one row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Institute Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Institute <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Select
                  value={instituteId}
                  onValueChange={setInstituteId}
                  disabled={dataLoading}
                  required
                >
                  <SelectTrigger className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder={dataLoading ? "Loading institutes..." : "Select an institute"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    {institutes.map(instituteItem => (
                      <SelectItem key={instituteItem._id} value={instituteItem._id} className="text-gray-900 dark:text-white">
                        {instituteItem.name} - {instituteItem.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {institutes.length === 0 && !dataLoading && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  No institutes available.
                </p>
              )}
            </div>

            {/* Year Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Select
                  value={yearId}
                  onValueChange={setYearId}
                  disabled={dataLoading}
                  required
                >
                  <SelectTrigger className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder={dataLoading ? "Loading years..." : "Select a year"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    {years.map(yearItem => (
                      <SelectItem key={yearItem._id} value={yearItem._id} className="text-gray-900 dark:text-white">
                        {yearItem.name} (A-Level Year {yearItem.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {years.length === 0 && !dataLoading && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  No years available.
                </p>
              )}
            </div>

            {/* Academic Level Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Academic Level <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Select
                  value={academicLevelId}
                  onValueChange={setAcademicLevelId}
                  disabled={dataLoading}
                  required
                >
                  <SelectTrigger className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder={dataLoading ? "Loading..." : "Select Level"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    {academicLevels.map(level => (
                      <SelectItem key={level._id} value={level._id} className="text-gray-900 dark:text-white">
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* File Upload (Main Tute File) */}
          <div>
            <label className="font-semibold text-foreground mb-3 block text-lg">
              Upload Main File (PDF, PPT, Images)
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
              {file ? (
                <div className="relative">
                  <p className="text-lg font-semibold text-green-600">File selected!</p>
                  <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Selected File ({file.name})
                  </a>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 p-0 shadow-lg"
                    onClick={() => setFile(null)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload size={24} className="text-primary" />
                  </div>
                  <Input
                    type="file"
                    accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="max-w-xs mx-auto bg-card text-foreground border-border"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Supported: .pdf, .ppt, .pptx, Images (Max 50MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="font-semibold text-foreground mb-3 block text-lg">
              Upload Thumbnail (Optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
              {thumbnail ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="Thumbnail"
                    className="mx-auto max-h-48 object-contain rounded-lg shadow-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 shadow-lg"
                    onClick={() => setThumbnail(null)}
                  >
                    <X size={16} />
                  </Button>
                  <p className="font-medium text-foreground mt-3">{thumbnail.name}</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload size={24} className="text-primary" />
                  </div>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                    className="max-w-xs mx-auto bg-card text-foreground border-border"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload an image for thumbnail (Max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="font-semibold text-foreground mb-3 block text-lg">Availability</label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="pl-3 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="all" className="text-gray-900 dark:text-white">All Students</SelectItem>
                <SelectItem value="physical" className="text-gray-900 dark:text-white">Physical Class Only</SelectItem>
                <SelectItem value="paid" className="text-gray-900 dark:text-white">Paid Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold text-foreground mb-3 block text-lg">Price (LKR)</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0"
              min="0"
              className="h-14 text-lg"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.push("/teacher/tutes")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {submitting ? "Creating..." : "Create Tute"}
            </Button>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}