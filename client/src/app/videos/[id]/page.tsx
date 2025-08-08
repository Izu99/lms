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
  Clock,
  Eye,
  User,
  Calendar,
  BookOpen,
  Edit,
  Trash2,
  ChevronLeft,
  Star,
  School,
  MapPin,
  GraduationCap,
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
  views: number; // ADD THIS LINE - Missing views field
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
  const [allVideos, setAllVideos] = useState<VideoData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [hasViewCounted, setHasViewCounted] = useState(false); // NEW: Track if view was counted

  // Get user data from localStorage
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
      setAllVideos(allVideos);

      const related = allVideos
        .filter((v: VideoData) => v._id !== videoId)
        .slice(0, 5);
      setRelatedVideos(related);
    } catch (error) {
      console.error("Error fetching related videos:", error);
    }
  };

  // NEW: Function to increment view count
  const incrementViewCount = async () => {
    if (hasViewCounted || !video) return; // Don't count multiple times

    try {
      await axios.post(
        `http://localhost:5000/api/videos/${videoId}/view`,
        {},
        { headers: getAuthHeaders() }
      );

      setHasViewCounted(true);

      // Update local video state with incremented view
      setVideo((prev) => (prev ? { ...prev, views: prev.views + 1 } : null));
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  // NEW: Handle video play event
  const handleVideoPlay = () => {
    setIsPlaying(true);
    incrementViewCount(); // Count view when video starts playing
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

  // Calculate progress
  const calculateProgress = () => {
    if (!video || !allVideos.length) {
      return { current: 1, total: allVideos.length || 1, percentage: 0 };
    }

    let relevantVideos = allVideos;
    if (video.class && video.year) {
      relevantVideos = allVideos.filter(
        (v) =>
          v.class &&
          v.year &&
          v.class._id === video.class!._id &&
          v.year._id === video.year!._id
      );
    }

    const sortedVideos = relevantVideos.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const currentIndex = sortedVideos.findIndex((v) => v._id === video._id);
    const total = sortedVideos.length;
    const current = currentIndex >= 0 ? currentIndex + 1 : 1;
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return { current, total, percentage };
  };

  const progress = calculateProgress();

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

  if (!user) {
    return null;
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
                controlsList={
                  user.role === "student"
                    ? "nodownload noremoteplayback"
                    : "noremoteplayback"
                }
                onPlay={handleVideoPlay}
                onPause={() => setIsPlaying(false)}
                onContextMenu={
                  user.role === "student"
                    ? (e) => e.preventDefault()
                    : undefined
                }
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

                  {/* Class and Year Info */}
                  {(video.class || video.year) && (
                    <div className="flex items-center gap-4 mb-3">
                      {video.class && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                          <School size={14} className="text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            {video.class.name} - {video.class.location}
                          </span>
                        </div>
                      )}
                      {video.year && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                          <GraduationCap size={14} className="text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            {video.year.name}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    {/* NEW: Show view count only to teachers */}
                    {user.role === "teacher" && (
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{video.views} views</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - NO DOWNLOAD BUTTON */}
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

                {/* Progress Info */}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    Video {progress.current} of {progress.total}
                  </p>
                  {video.class && video.year && (
                    <p className="text-xs text-gray-500">
                      {video.class.name} - {video.year.name}
                    </p>
                  )}
                </div>
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
                {video.class
                  ? `${video.class.name} - ${video.class.location}`
                  : "ICT A-Level Lessons"}
              </h2>
              <p className="text-sm text-gray-600">
                AL ICT / EduForm Platform{" "}
                {video.year ? `${video.year.name} ` : ""}
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
                          className="w-20 h-14 bg-gray-200 rounded object-cover"
                          preload=""
                        >
                          <source
                            src={`http://localhost:5000/${relatedVideo.videoUrl}`}
                          />
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
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-green-700">
                      {progress.percentage}%
                    </span>
                  </div>
                  <p className="text-sm text-green-600">
                    {progress.current} of {progress.total} lessons completed
                  </p>
                </div>
              )}

              {/* Teacher Stats - NOW SHOWS ACTUAL VIEWS */}
              {user.role === "teacher" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">
                    Video Analytics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Student Views:</span>
                      <span className="font-medium">{video.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Total Videos:</span>
                      <span className="font-medium">{progress.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Current Position:</span>
                      <span className="font-medium">{progress.current}</span>
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
