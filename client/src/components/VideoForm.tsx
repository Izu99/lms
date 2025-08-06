"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Video } from "lucide-react";

interface VideoData {
  _id?: string;
  title: string;
  description: string;
  duration: string;
  thumbnail?: string;
  videoUrl: string;
  course: string;
  views?: number;
  uploadedAt?: string;
  uploadedBy?: string;
}

interface VideoFormProps {
  video?: VideoData | null;
  onSave: (video: any) => void;
  onClose: () => void;
}

export default function VideoForm({ video, onSave, onClose }: VideoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    videoUrl: "",
    course: "",
    thumbnail: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        description: video.description,
        duration: video.duration,
        videoUrl: video.videoUrl,
        course: video.course,
        thumbnail: video.thumbnail || ""
      });
    }
  }, [video]);

  const courses = [
    "Programming Fundamentals",
    "Database Design", 
    "Web Development",
    "Computer Networks",
    "System Analysis"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (video) {
        // Update existing video
        await onSave({ ...video, ...formData });
      } else {
        // Create new video
        await onSave(formData);
      }
    } catch (error) {
      console.error("Error saving video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {video ? "Edit Video" : "Add New Video"}
          </h2>
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter video description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (MM:SS) *
            </label>
            <Input
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 15:30"
              pattern="^\d{1,2}:\d{2}$"
              required
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL *
            </label>
            <Input
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="Enter video file path or URL"
              required
            />
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail URL (Optional)
            </label>
            <Input
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="Enter thumbnail image URL"
            />
          </div>

          {/* Preview */}
          {formData.title && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-32 h-18 bg-gray-200 rounded flex items-center justify-center">
                    {formData.thumbnail ? (
                      <img 
                        src={formData.thumbnail} 
                        alt="Thumbnail"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <Video className="text-gray-400" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{formData.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{formData.course}</span>
                      <span>{formData.duration}</span>
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
                  Saving...
                </div>
              ) : (
                video ? "Update Video" : "Add Video"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
