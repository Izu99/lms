"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import VideoForm from "@/components/VideoForm";
import {
  Video,
  Plus,
  Edit,
  Trash2,
  Play,
  Search,
  User,
  Calendar,
  School,
  GraduationCap,
  Eye, // Added missing Eye import
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { API_URL, API_BASE_URL } from "@/lib/constants";

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
  views: number; // Added missing views field
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  username: string;
  role: "student" | "teacher" | "admin";
}

export default function VideoManagementPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);

  // Get user data from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      window.location.href = "/login";
    } finally {
      setUserLoading(false);
    }
  }, []);

  // Fetch videos after user is loaded
  useEffect(() => {
    if (user && !userLoading) {
      fetchVideos();
    }
  }, [user, userLoading]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/videos`, {
        headers: getAuthHeaders(),
      });
      console.log("Videos fetched:", response.data);
      setVideos(response.data.videos || response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Please login to access videos");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (formData: FormData) => {
    try {
      const response = await axios.post(
        `${API_URL}/videos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeaders(),
          },
        }
      );

      await fetchVideos();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding video:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Please login to upload videos");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        alert("Error uploading video. Please try again.");
      }
    }
  };

  const handleUpdateVideo = async (videoId: string, formData: FormData) => {
    try {
      const response = await axios.put(
        `${API_URL}/videos/${videoId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeaders(),
          },
        }
      );

      await fetchVideos();
      setEditingVideo(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error updating video:", error);
      alert("Error updating video. Please try again.");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`${API_URL}/videos/${videoId}`, {
        headers: getAuthHeaders(),
      });

      setVideos(videos.filter((video) => video._id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Error deleting video. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const openEditForm = (video: VideoData) => {
    setEditingVideo(video);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingVideo(null);
    setIsFormOpen(true);
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render if no user (will redirect in useEffect)
  if (!user) {
    return null;
  }

  // Check if user is student - different view
  const isStudent = user.role === "student";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Statistics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Video className="text-blue-600" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isStudent
                    ? "Video Learning Hub"
                    : "Video Content Management"}
                </h1>
                <p className="text-gray-600">
                  {isStudent
                    ? "Access your ICT A-Level course videos and track progress"
                    : "Upload, organize and manage your course video content"}
                </p>
              </div>
            </div>
            {/* Only show upload button for teachers/admin */}
            {!isStudent && (
              <Button onClick={openAddForm} className="flex items-center gap-2">
                <Plus size={20} />
                Upload New Video
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Statistics Cards - Role Based */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Videos */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Video className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {isStudent ? "Available Videos" : "Total Videos"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {videos.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Classes/Subjects */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <School className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {isStudent ? "My Classes" : "Active Classes"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      [
                        ...new Set(
                          videos.filter((v) => v.class).map((v) => v.class!._id)
                        ),
                      ].length
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Years/Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {isStudent ? "Learning Progress" : "Academic Years"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isStudent
                      ? "65%" // You can calculate actual progress here
                      : [
                          ...new Set(
                            videos.filter((v) => v.year).map((v) => v.year!._id)
                          ),
                        ].length}
                  </p>
                </div>
              </div>
            </div>

            {/* Role-specific 4th card */}
            {/* Role-specific 4th card - FIXED */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  {isStudent ? (
                    <Calendar className="text-orange-600" size={24} />
                  ) : (
                    <User className="text-orange-600" size={24} />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {isStudent ? "Hours Watched" : "Content Creators"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isStudent
                      ? "24.5hrs" // This works fine for students
                      : [
                          ...new Set(
                            videos
                              .filter((v) => v.uploadedBy)
                              .map((v) => v.uploadedBy._id)
                          ),
                        ].length}{" "}
                    {/* // Fixed for teachers */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                  <video className="w-full h-full object-cover">
                    <source
                      src={`${API_BASE_URL}/${video.videoUrl}`}
                      type="video/mp4"
                    />
                  </video>

                  <div className="absolute inset-0 bg-black/10 bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Link href={`/videos/${video._id}`}>
                      <Button size="sm" className="flex items-center gap-2">
                        <Play size={16} />
                        Watch
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description || "No description available"}
                  </p>

                  {/* Class, Year Info and View Count */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {video.class && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                        <School size={12} className="text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">
                          {video.class.name} - {video.class.location}
                        </span>
                      </div>
                    )}
                    {video.year && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                        <GraduationCap size={12} className="text-green-600" />
                        <span className="text-xs font-medium text-green-700">
                          {video.year.name}
                        </span>
                      </div>
                    )}
                    {/* View Count Badge - Only show to teachers */}
                    {/* {user.role === "teacher" && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
                        <Eye size={12} className="text-orange-600" />
                        <span className="text-xs font-medium text-orange-700">
                          {video.views || 0} views
                        </span>
                      </div>
                    )} */}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <User size={14} />
                    <span>{video.uploadedBy?.username || "Unknown"}</span>
                    <span>•</span>
                    <Calendar size={14} />
                    <span>{formatDate(video.createdAt)}</span>
                    {/* View Count Badge - Only show to teachers */}
                    {user.role === "teacher" && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full">
                        <Eye size={12} className="" />
                        <span className="text-xs font-medium ">
                          {video.views || 0} views
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Different for Students vs Teachers */}
                  <div className="flex gap-2">
                    <Link href={`/videos/${video._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Play size={16} className="mr-1" />
                        {isStudent ? "Watch Lesson" : "View"}
                      </Button>
                    </Link>

                    {/* Only show edit/delete for teachers/admin */}
                    {!isStudent && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(video)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVideo(video._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredVideos.length === 0 && !loading && (
          <div className="text-center py-12">
            <Video className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No videos found
            </h3>
            <p className="text-gray-600 mb-6">
              {isStudent
                ? "No video lessons available yet"
                : "Upload your first video to get started"}
            </p>
            {!isStudent && (
              <Button onClick={openAddForm}>
                <Plus size={20} className="mr-2" />
                Upload New Video
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Video Form Modal - Only for teachers/admin */}
      {!isStudent && isFormOpen && (
        <VideoForm
          video={editingVideo}
          onSave={
            editingVideo
              ? (formData) => handleUpdateVideo(editingVideo._id, formData)
              : handleAddVideo
          }
          onClose={() => {
            setIsFormOpen(false);
            setEditingVideo(null);
          }}
        />
      )}
    </div>
  );
}
