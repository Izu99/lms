"use client";
import { useState, useEffect } from "react";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
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
import { API_URL, API_BASE_URL } from "@/lib/constants";
import { CreateVideoModal } from "@/components/modals/CreateVideoModal";

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
  const [allVideos, setAllVideos] = useState<VideoData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [hasViewCounted, setHasViewCounted] = useState(false); // NEW: Track if view was counted
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  // Only fetch video data after user is loaded
  useEffect(() => {
    if (user && !userLoading) {
      fetchVideo();
      fetchAllVideos();
    }
  }, [videoId, user, userLoading]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchVideo = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/videos/${videoId}`,
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
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVideos = async () => {
    try {
      const response = await axios.get(`${API_URL}/videos`, {
        headers: getAuthHeaders(),
      });
      const allVideos = response.data.videos || response.data;
      setAllVideos(allVideos);
    } catch (error) {
      console.error("Error fetching all videos:", error);
    }
  };

  // NEW: Function to increment view count
  const incrementViewCount = async () => {
    if (hasViewCounted || !video) return; // Don't count multiple times

    try {
      await axios.post(
        `${API_URL}/videos/${videoId}/view`,
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
      await axios.delete(`${API_URL}/videos/${videoId}`, {
        headers: getAuthHeaders(),
      });

      alert("Video deleted successfully");
      window.location.href = "/teacher/videos";
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Error deleting video. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </TeacherLayout>
    );
  }

  if (!video) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Video not found</h2>
          <Link href="/teacher/videos">
            <Button className="mt-4">Back to Videos</Button>
          </Link>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="flex-1 bg-background text-foreground">
        <div className="sticky top-0">
          {/* Video Player Container */}
          <div className="relative bg-background rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <video
              className="w-full h-full object-contain"
              controls
              controlsList="noremoteplayback"
              onPlay={handleVideoPlay}
              onPause={() => setIsPlaying(false)}
            >
              <source
                src={`${API_BASE_URL}/api/uploads/${video.videoUrl}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Info Below Player */}
          <div className="bg-card p-6 border-t border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {video.title}
                </h1>

                {/* Class and Year Info */}
                {(video.class || video.year) && (
                  <div className="flex items-center gap-4 mb-3">
                    {video.class && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                        <School size={14} className="text-primary" />
                        <span className="text-sm font-medium text-primary">
                          {video.class.name} - {video.class.location}
                        </span>
                      </div>
                    )}
                    {video.year && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                        <GraduationCap size={14} className="text-green-500" />
                        <span className="text-sm font-medium text-green-500">
                          {video.year.name}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{video.views} views</span>
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
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit size={16} />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteVideo}
                  className="flex items-center gap-2 text-destructive hover:text-destructive/80"
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </div>

            {/* Video Creator Info */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {video.uploadedBy?.username || "Unknown"}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    ICT A-Level {video.uploadedBy?.role || "User"}
                  </p>
                </div>
              </div>

              {/* Progress Info */}
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Video {progress.current} of {progress.total}
                </p>
                {video.class && video.year && (
                  <p className="text-xs text-muted-foreground">
                    {video.class.name} - {video.year.name}
                  </p>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
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
                <div className="bg-muted rounded-lg p-4">
                  <div className="prose max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed">
                      {video.description}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreateVideoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          fetchVideo();
        }}
        video={video}
      />
    </TeacherLayout>
  );
}