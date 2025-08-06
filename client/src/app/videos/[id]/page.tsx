"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  Clock,
  Eye,
  User,
  Calendar,
  BookOpen,
  Edit,
  Trash2,
  ChevronLeft,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

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

interface UserData {
  username: string;
  role: "student" | "teacher" | "admin";
}

export default function VideoViewPage() {
  const params = useParams();
  const videoId = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState<VideoData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDescription, setShowDescription] = useState(true);

  // Get user data from localStorage - SAME AS DASHBOARD
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      window.location.href = "/auth/login";
    } finally {
      setUserLoading(false);
    }
  }, []);

  // Only fetch video data after user is loaded
  useEffect(() => {
    if (user && !userLoading) {
      fetchVideo();
      fetchRelatedVideos();
    }
  }, [videoId, user, userLoading]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchVideo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/videos/${videoId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      setVideo(response.data.video || response.data);
    } catch (error) {
      console.error("Error fetching video:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/videos", {
        headers: getAuthHeaders(),
      });
      const allVideos = response.data.videos || response.data;
      const related = allVideos
        .filter((v: VideoData) => v._id !== videoId)
        .slice(0, 5);
      setRelatedVideos(related);
    } catch (error) {
      console.error("Error fetching related videos:", error);
    }
  };

  const handleDeleteVideo = async () => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/videos/${videoId}`, {
        headers: getAuthHeaders(),
      });

      alert("Video deleted successfully");
      window.location.href = "/videos";
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Error deleting video. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Don't render navbar until user is loaded
  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Video not found</h2>
          <Link href="/videos">
            <Button className="mt-4">Back to Videos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Video Player */}
        <div className="flex-1 bg-black">
          <div className="sticky top-16">
            {/* Video Player Container */}
            <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
              <video
                className="w-full h-full object-contain"
                controls
                poster={video.thumbnail}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source
                  src={`http://localhost:5000/${video.videoUrl}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info Below Player */}
            <div className="bg-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {video.title}
                  </h1>
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>45 views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp size={16} />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Share size={16} />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </Button>

                  {/* Teacher-only actions */}
                  {user.role === "teacher" && (
                    <>
                      <Link href={`/videos/edit/${video._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteVideo}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Video Creator Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {video.uploadedBy?.username || "Unknown"}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      ICT A-Level {video.uploadedBy?.role || "User"}
                    </p>
                  </div>
                </div>

                {user.role === "student" && (
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Subscribe
                  </Button>
                )}
              </div>

              {/* Description Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    About this lesson
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDescription(!showDescription)}
                  >
                    {showDescription ? "Hide" : "Show"}
                  </Button>
                </div>

                {showDescription && video.description && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                        {video.description}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Related Videos & Course Info */}
        <div className="w-full lg:w-96 bg-white border-l">
          <div className="sticky top-16 max-h-screen overflow-y-auto">
            {/* Course Navigation */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Link href="/videos">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    Back to Videos
                  </Button>
                </Link>
              </div>
              <h2 className="font-semibold text-gray-900">
                ICT A-Level Lessons
              </h2>
              <p className="text-sm text-gray-600">
                Programming • Database • Web Development
              </p>
            </div>

            {/* Current Video Highlight */}
            <div className="p-4 bg-blue-50 border-b">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium text-blue-600">
                  Currently Watching
                </span>
              </div>
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                {video.title}
              </h4>
            </div>

            {/* Related Videos */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Next Lessons</h3>

              <div className="space-y-3">
                {relatedVideos.map((relatedVideo, index) => (
                  <Link
                    href={`/videos/${relatedVideo._id}`}
                    key={relatedVideo._id}
                    className="block hover:bg-gray-50 rounded-lg p-3 transition-colors border"
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <video
                          className="w-20 h-14 bg-gray-200 rounded object-cover cursor-pointer"
                          src={`http://localhost:5000/${relatedVideo.videoUrl}`}
                          preload=""
                          onClick={(event) => {
                            event.preventDefault();
                            // Your play logic here
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                        <div className="absolute top-1 left-1 bg-gray-900 text-white text-xs px-1 rounded">
                          {index + 2}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                          {relatedVideo.title}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1">
                          {relatedVideo.uploadedBy?.username || "Unknown"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{formatDateShort(relatedVideo.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Course Progress (for students) */}
              {user.role === "student" && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    Your Progress
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "35%" }}
                      ></div>
                    </div>
                    <span className="text-sm text-green-700">35%</span>
                  </div>
                  <p className="text-sm text-green-600">
                    3 of 8 lessons completed
                  </p>
                </div>
              )}

              {/* Teacher Stats */}
              {user.role === "teacher" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">
                    Video Analytics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Total Views:</span>
                      <span className="font-medium">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Students Watched:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Completion Rate:</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Study Notes (for students) */}
              {user.role === "student" && (
                <div className="mt-6">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen size={16} className="mr-2" />
                    Take Notes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
