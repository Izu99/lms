"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Video, File, School, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { InfoDialog } from "@/components/InfoDialog";
import Cookies from "js-cookie";

interface VideoData {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  uploadedBy: {
    _id: string;
    username: string;
    role: string;
  };
  institute?: {
    _id: string;
    name: string;
    location: string;
  };
  year?: {
    _id: string;
    year: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
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

interface VideoFormProps {
  video?: VideoData | null;
  onSuccess: () => void;
  onClose: () => void;
}

export default function VideoForm({ video, onSuccess, onClose }: VideoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instituteId: "",
    yearId: ""
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [institutes, setInstitutes] = useState<InstituteData[]>([]);
  const [years, setYears] = useState<YearData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchInstitutesAndYears();
    
    if (video) {
      setFormData({
        title: video.title,
        description: video.description || "",
        instituteId: video.institute ? video.institute._id : "",
        yearId: video.year ? video.year._id : ""
      });
    }
  }, [video]);

  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchInstitutesAndYears = async () => {
    try {
      setDataLoading(true);
      const [classRes, yearRes] = await Promise.all([
        axios.get(`${API_URL}/institutes`, { headers: getAuthHeaders() }),
        axios.get(`${API_URL}/years`, { headers: getAuthHeaders() })
      ]);
      
      setInstitutes(classRes.data.institutes || []);
      setYears(yearRes.data.years || []);
    } catch (error) {
      console.error("Error fetching institutes and years:", error);
      setInfoDialogContent({ title: "Error", description: "Error loading institutes and years. Please try again." });
      setIsInfoOpen(true);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        setInfoDialogContent({ title: "Validation Error", description: "Please enter a video title" });
        setIsInfoOpen(true);
        setLoading(false);
        return;
      }

      if (!formData.instituteId) {
        setInfoDialogContent({ title: "Validation Error", description: "Please select an institute" });
        setIsInfoOpen(true);
        setLoading(false);
        return;
      }

      if (!formData.yearId) {
        setInfoDialogContent({ title: "Validation Error", description: "Please select a year" });
        setIsInfoOpen(true);
        setLoading(false);
        return;
      }

      if (!video && !videoFile) {
        setInfoDialogContent({ title: "Validation Error", description: "Please select a video file" });
        setIsInfoOpen(true);
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('institute', formData.instituteId);
      submitData.append('year', formData.yearId);
      
      // Only append video file if one is selected
      if (videoFile) {
        submitData.append('video', videoFile);
      }

      if (video) {
        // Update existing video
        await axios.put(`${API_URL}/videos/${video._id}`, submitData, {
          headers: getAuthHeaders(),
        });
      } else {
        // Create new video
        await axios.post(`${API_URL}/videos`, submitData, {
          headers: getAuthHeaders(),
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving video:", error);
      setInfoDialogContent({ title: "Error", description: "Error saving video. Please try again." });
      setIsInfoOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Only check file type - NO SIZE LIMIT
      if (!file.type.startsWith('video/')) {
        setInfoDialogContent({ title: "Invalid File Type", description: "Please select a video file" });
        setIsInfoOpen(true);
        return;
      }
      
      // Size limit removed - accept any video size
      setVideoFile(file);
    }
  };

  // Helper function to format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const selectedInstitute = institutes.find(i => i._id === formData.instituteId);
  const selectedYear = years.find(y => y._id === formData.yearId);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Video className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {video ? "Edit Video" : "Upload New Video"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter video title"
              required
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>

          {/* Class and Year Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Institute *
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Select
                  value={formData.instituteId}
                  onValueChange={(value) => setFormData({ ...formData, instituteId: value })}
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
                  No institutes available. Please create an institute first.
                </p>
              )}
            </div>

            {/* Year Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Academic Year *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <Select
                  value={formData.yearId}
                  onValueChange={(value) => setFormData({ ...formData, yearId: value })}
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
                  No years available. Please create a year first.
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions for missing data */}
          {((institutes.length === 0 || years.length === 0) && !dataLoading) && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">Setup Required</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                You need to create institutes and years before uploading videos.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open('/settings', '_blank')}
                className="text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30"
              >
                Open Settings Page
              </Button>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter video description (optional)"
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Video File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video File {!video && "*"}
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors bg-gray-50 dark:bg-gray-900/30">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                {videoFile ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <File size={24} />
                    <div className="text-center">
                      <span className="font-medium block">{videoFile.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(videoFile.size)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400 dark:text-gray-500 mb-2" size={32} />
                    <p className="text-gray-600 dark:text-gray-300">
                      {video ? "Upload new video file (optional)" : "Click to upload video file"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      MP4, WebM, or other video formats (no size limit)
                    </p>
                  </div>
                )}
              </label>
            </div>
            {video && !videoFile && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Current video will be kept if no new file is uploaded
              </p>
            )}
          </div>

          {/* Preview */}
          {formData.title && formData.instituteId && formData.yearId && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
              <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-14 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                    <Video className="text-gray-400 dark:text-gray-500" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{formData.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {formData.description || "No description"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {selectedInstitute && (
                        <div className="flex items-center gap-1">
                          <School size={12} />
                          <span>{selectedInstitute.name} - {selectedInstitute.location}</span>
                        </div>
                      )}
                      {selectedYear && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{selectedYear.name}</span>
                        </div>
                      )}
                      {videoFile && (
                        <div className="flex items-center gap-1">
                          <File size={12} />
                          <span>{videoFile.name} ({formatFileSize(videoFile.size)})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || dataLoading || institutes.length === 0 || years.length === 0} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {video ? "Updating..." : "Uploading..."}
                </div>
              ) : (
                video ? "Update Video" : "Upload Video"
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
