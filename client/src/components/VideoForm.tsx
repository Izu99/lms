"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Video, File } from "lucide-react";

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
  createdAt: string;
  updatedAt: string;
}

interface VideoFormProps {
  video?: VideoData | null;
  onSave: (formData: FormData) => void;
  onClose: () => void;
}

export default function VideoForm({ video, onSave, onClose }: VideoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        description: video.description || ""
      });
    }
  }, [video]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      
      // Only append video file if one is selected (required for new videos)
      if (videoFile) {
        submitData.append('video', videoFile);
      } else if (!video) {
        // If creating new video and no file selected, show error
        alert("Please select a video file");
        setLoading(false);
        return;
      }

      await onSave(submitData);
    } catch (error) {
      console.error("Error saving video:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      
      // Check file size (limit to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('Video file size should be less than 100MB');
        return;
      }
      
      setVideoFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {video ? "Edit Video" : "Upload New Video"}
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
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter video description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Video File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File {!video && "*"}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
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
                    <span className="font-medium">{videoFile.name}</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-600">
                      {video ? "Upload new video file (optional)" : "Click to upload video file"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      MP4, WebM, or other video formats (max 100MB)
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
          {formData.title && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-32 h-18 bg-gray-200 rounded flex items-center justify-center">
                    <Video className="text-gray-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{formData.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {videoFile && <span>File: {videoFile.name}</span>}
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
                  {video ? "Updating..." : "Uploading..."}
                </div>
              ) : (
                video ? "Update Video" : "Upload Video"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
