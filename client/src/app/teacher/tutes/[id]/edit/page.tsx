"use client";

import { useState, useEffect } from "react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ArrowLeft, Upload, FileText, X, School, Calendar, GraduationCap } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { API_URL, API_BASE_URL } from "@/lib/constants";
import { toast } from "sonner";

export default function EditTutePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("all");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState("");
  const [currentFileType, setCurrentFileType] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null); // New state for new thumbnail
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState(""); // New state for existing thumbnail
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [institutes, setInstitutes] = useState<{ _id: string, name: string }[]>([]);
  const [years, setYears] = useState<{ _id: string, year: string, name: string }[]>([]);
  const [instituteId, setInstituteId] = useState("");
  const [yearId, setYearId] = useState("");
  const [academicLevelId, setAcademicLevelId] = useState(""); // Add academicLevelId state
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

  useEffect(() => {
    fetchTute();
  }, [id]);

  const fetchTute = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/tutes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tute = response.data; // Corrected: Assuming the API returns the tute object directly
      setTitle(tute.title);
      setDescription(tute.description || "");
      setAvailability(tute.availability);
      setPrice(tute.price);
      setCurrentFileUrl(tute.fileUrl);
      setCurrentFileType(tute.fileType);
      setCurrentThumbnailUrl(tute.thumbnailUrl || ""); // Set existing thumbnail URL
      setInstituteId(tute.institute?._id || tute.institute || "");
      setYearId(tute.year?._id || tute.year || "");
      setAcademicLevelId(tute.academicLevel || ""); // Populate academicLevelId
    } catch (error) {
      console.error("Error fetching tute:", error);
      toast.error("Failed to load tute");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!instituteId) {
      toast.error("Please select an institute.");
      return;
    }
    if (!yearId) {
      toast.error("Please select an academic year.");
      return;
    }
    if (!academicLevelId) {
      toast.error("Please select an academic level.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("availability", availability);
    formData.append("price", price.toString());
    formData.append("institute", instituteId);
    formData.append("year", yearId);
    formData.append("academicLevel", academicLevelId); // Append academicLevel
    if (file) {
      formData.append("file", file);
    } else if (!currentFileUrl) { // If no new file and current file is cleared, signal removal
      formData.append("removeFile", "true");
    }
    if (thumbnail) { // Append thumbnail if it exists
      formData.append("thumbnail", thumbnail);
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/tutes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Tute updated successfully!");
      router.push("/teacher/tutes");
    } catch (error: any) {
      console.error("Error updating tute:", error);
      toast.error(error.response?.data?.message || "Failed to update tute");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Edit Tute</h1>
              <p className="text-muted-foreground text-lg">Update tutorial information</p>
            </div>
          </div>
          <Button variant="outline" size="lg" onClick={() => router.push("/teacher/tutes")}>
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-xl border border-border p-8 space-y-6">
          {/* Institute and Year Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Institute Selection */}
            <div>
              <label className="font-semibold text-foreground mb-3 block text-lg">
                Institute <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Select
                  value={instituteId}
                  onValueChange={setInstituteId}
                  disabled={dataLoading}
                >
                  <SelectTrigger className="h-14 pl-10 text-lg border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder={dataLoading ? "Loading..." : "Select Institute"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    {institutes.map(inst => (
                      <SelectItem key={inst._id} value={inst._id} className="text-gray-900 dark:text-white">
                        {inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Academic Level Selection */}
            <div>
              <label className="font-semibold text-foreground mb-3 block text-lg">
                Academic Level <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Select
                  value={academicLevelId}
                  onValueChange={setAcademicLevelId}
                  disabled={dataLoading}
                >
                  <SelectTrigger className="h-14 pl-10 text-lg border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
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

            {/* Year Selection */}
            <div>
              <label className="font-semibold text-foreground mb-3 block text-lg">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Select
                  value={yearId}
                  onValueChange={setYearId}
                  disabled={dataLoading}
                >
                  <SelectTrigger className="h-14 pl-10 text-lg border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <SelectValue placeholder={dataLoading ? "Loading..." : "Select Year"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    {years.map(yr => (
                      <SelectItem key={yr._id} value={yr._id} className="text-gray-900 dark:text-white">
                        {yr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div >

          {/* Title */}
          < div >
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
          </div >

          {/* Description */}
          < div >
            <label className="font-semibold text-foreground mb-3 block text-lg">Description (Optional)</label>
            <Textarea
              placeholder="Brief description of the tutorial content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] text-lg"
            />
          </div >

          {/* File Upload (Main Tute File) */}
          < div >
            <label className="font-semibold text-foreground mb-3 block text-lg">
              Main File {file ? <span className="text-red-500">*</span> : "(Optional - leave empty to keep current file)"}
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
              {file || currentFileUrl ? (
                <div className="relative">
                  <p className="text-lg font-semibold text-green-600">File available!</p>
                  <a href={`${API_BASE_URL}${file ? URL.createObjectURL(file) : currentFileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Uploaded File ({file ? file.name : currentFileUrl.split('/').pop()})
                  </a>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 p-0 shadow-lg"
                    onClick={() => {
                      setFile(null);
                      setCurrentFileUrl("");
                      setCurrentFileType("");
                    }}
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
          </div >

          {/* Thumbnail Upload */}
          < div >
            <label className="font-semibold text-foreground mb-3 block text-lg">
              Thumbnail (Optional - leave empty to keep current)
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
              {(currentThumbnailUrl || thumbnail) ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail ? URL.createObjectURL(thumbnail) : `${API_BASE_URL}${currentThumbnailUrl}`}
                    alt="Thumbnail"
                    className="mx-auto max-h-48 object-contain rounded-lg shadow-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 shadow-lg"
                    onClick={() => {
                      setCurrentThumbnailUrl(""); // Clear existing URL
                      setThumbnail(null); // Clear newly selected file
                    }}
                  >
                    <X size={16} />
                  </Button>
                  <p className="font-medium text-foreground mt-3">{thumbnail?.name || currentThumbnailUrl.split('/').pop()}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload size={48} className="mx-auto text-muted-foreground" />
                  <p className="text-foreground font-medium">Upload New Thumbnail (Optional)</p>
                  <p className="text-sm text-muted-foreground">Supported: .jpg, .jpeg, .png, .gif, .webp (Max 5MB)</p>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                    className="max-w-xs mx-auto"
                  />
                </div>
              )}
            </div>
          </div >

          {/* Availability */}
          < div >
            <label className="font-semibold text-foreground mb-3 block text-lg">Availability</label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="h-14 text-lg border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectItem value="all" className="text-gray-900 dark:text-white">All Students</SelectItem>
                <SelectItem value="physical" className="text-gray-900 dark:text-white">Physical Class Only</SelectItem>
                <SelectItem value="paid" className="text-gray-900 dark:text-white">Paid Only</SelectItem>
              </SelectContent>
            </Select>
          </div >

          {/* Price */}
          < div >
            <label className="font-semibold text-foreground mb-3 block text-lg">Price (LKR)</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0"
              min="0"
              className="h-14 text-lg"
            />
          </div >

          {/* Submit Button */}
          < div className="flex gap-4 pt-6" >
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
              type="submit"
              disabled={submitting}
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {submitting ? "Updating..." : "Update Tute"}
            </Button>
          </div >
        </form >
      </div >
    </TeacherLayout >
  );
}
