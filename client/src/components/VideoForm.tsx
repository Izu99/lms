"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Video, File, School, Calendar } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { InfoDialog } from "@/components/InfoDialog";

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
  class?: {
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

interface ClassData {
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
  onSave: (formData: FormData) => void;
  onClose: () => void;
}

export default function VideoForm({ video, onSave, onClose }: VideoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: "",
    yearId: ""
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [years, setYears] = useState<YearData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchClassesAndYears();
    
    if (video) {
      setFormData({
        title: video.title,
        description: video.description || "",
        classId: video.class ? video.class._id : "",
        yearId: video.year ? video.year._id : ""
      });
    }
  }, [video]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchClassesAndYears = async () => {
    try {
      setDataLoading(true);
      const [classRes, yearRes] = await Promise.all([
        axios.get(`${API_URL}/classes`, { headers: getAuthHeaders() }),
        axios.get(`${API_URL}/years`, { headers: getAuthHeaders() })
      ]);
      
      setClasses(classRes.data.classes || []);
      setYears(yearRes.data.years || []);
    } catch (error) {
      console.error("Error fetching classes and years:", error);
      setInfoDialogContent({ title: "Error", description: "Error loading classes and years. Please try again." });
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

      if (!formData.classId) {
        setInfoDialogContent({ title: "Validation Error", description: "Please select a class" });
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
      submitData.append('class', formData.classId);
      submitData.append('year', formData.yearId);
      
      // Only append video file if one is selected
      if (videoFile) {
        submitData.append('video', videoFile);
      }

      await onSave(submitData);
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

  const selectedClass = classes.find(c => c._id === formData.classId);
  const selectedYear = years.find(y => y._id === formData.yearId);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Video className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {video ? "Edit Video" : "Upload New Video"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter video title"
              required
            />
          </div>

          {/* Class and Year Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class *
              </label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  required
                  disabled={dataLoading}
                >
                  <option value="">
                    {dataLoading ? "Loading classes..." : "Select a class"}
                  </option>
                  {classes.map(classItem => (
                    <option key={classItem._id} value={classItem._id}>
                      {classItem.name} - {classItem.location}
                    </option>
                  ))}
                </select>
              </div>
              {classes.length === 0 && !dataLoading && (
                <p className="text-xs text-amber-600 mt-1">
                  No classes available. Please create a class first.
                </p>
              )}
            </div>

            {/* Year Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={formData.yearId}
                  onChange={(e) => setFormData({ ...formData, yearId: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  required
                  disabled={dataLoading}
                >
                  <option value="">
                    {dataLoading ? "Loading years..." : "Select a year"}
                  </option>
                  {years.map(yearItem => (
                    <option key={yearItem._id} value={yearItem._id}>
                      {yearItem.name} (A-Level Year {yearItem.year})
                    </option>
                  ))}
                </select>
              </div>
              {years.length === 0 && !dataLoading && (
                <p className="text-xs text-amber-600 mt-1">
                  No years available. Please create a year first.
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions for missing data */}
          {((classes.length === 0 || years.length === 0) && !dataLoading) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-amber-800 mb-2">Setup Required</h4>
              <p className="text-sm text-amber-700 mb-3">
                You need to create classes and years before uploading videos.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open('/settings', '_blank')}
                className="text-amber-700 border-amber-300 hover:bg-amber-50"
              >
                Open Settings Page
              </Button>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter video description (optional)"
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Video File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File {!video && "*"}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-300 transition-colors">
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
                  <div className="flex items-center gap-2 text-green-600">
                    <File size={24} />
                    <div className="text-center">
                      <span className="font-medium block">{videoFile.name}</span>
                      <span className="text-sm text-gray-500">
                        {formatFileSize(videoFile.size)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-600">
                      {video ? "Upload new video file (optional)" : "Click to upload video file"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      MP4, WebM, or other video formats (no size limit)
                    </p>
                  </div>
                )}
              </label>
            </div>
            {video && !videoFile && (
              <p className="text-sm text-gray-500 mt-2">
                Current video will be kept if no new file is uploaded
              </p>
            )}
          </div>

          {/* Preview */}
          {formData.title && formData.classId && formData.yearId && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-14 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Video className="text-gray-400" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1">{formData.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {formData.description || "No description"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {selectedClass && (
                        <div className="flex items-center gap-1">
                          <School size={12} />
                          <span>{selectedClass.name} - {selectedClass.location}</span>
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
          <div className="flex gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || dataLoading || classes.length === 0 || years.length === 0} 
              className="flex-1"
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
