"use client";
import { useState, useEffect, useRef } from "react";
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
import { StudentLayout } from "@/components/student/StudentLayout";

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
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  username: string;
  role: "student" | "teacher" | "admin";
}

export default function StudentVideoViewPage() {
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
  const [hasViewCounted, setHasViewCounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const fetchRelatedVideos = async () => {
    try {
      const response = await axios.get(`${API_URL}/videos`, {
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

  const incrementViewCount = async () => {
    if (hasViewCounted || !video) return;

    try {
      await axios.post(
        `${API_URL}/videos/${videoId}/view`,
        {},
        { headers: getAuthHeaders() }
      );

      setHasViewCounted(true);

      setVideo((prev) => (prev ? { ...prev, views: prev.views + 1 } : null));
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    incrementViewCount();
  };

  const handleTimeUpdate = async () => {
    if (!videoRef.current || user?.role !== 'student') return;

    const { currentTime, duration } = videoRef.current;
    const completed = currentTime / duration >= 0.9; // 90% watched

    // Send update every 10 seconds
    if (Math.round(currentTime) % 10 === 0) {
      try {
        await axios.post(
          `${API_URL}/videos/${videoId}/watch`,
          { videoId, duration: currentTime, completed },
          { headers: getAuthHeaders() }
        );
      } catch (error) {
        console.error("Error recording watch data:", error);
      }
    }
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

  if (userLoading || loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </StudentLayout>
    );
  }

  if (!user || !video) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold theme-text-primary">Video not found</h2>
          <Link href="/student/videos">
            <Button className="mt-4">Back to Videos</Button>
          </Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="flex flex-col lg:flex-row -m-6 lg:-m-8">
        <div className="flex-1 bg-black">
          {/* New: Video Title at the very top */}
          <div className="theme-bg-primary p-6 pb-0">
            <h1 className="text-3xl font-bold theme-text-primary mb-4">
              {video.title}
            </h1>
          </div>

          <div className="sticky top-16">
            <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                controls
                controlsList={
                  user.role === "student"
                    ? "nodownload noremoteplayback"
                    : "noremoteplayback"
                }
                onPlay={handleVideoPlay}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onContextMenu={
                  user.role === "student"
                    ? (e) => e.preventDefault()
                    : undefined
                }
                preload="metadata"
              >
                <source
                  src={`${API_BASE_URL}/uploads/${video.videoUrl}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="theme-bg-primary p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {(video.class || video.year) && (
                    <div className="flex items-center gap-4 mb-3">
                      {video.class && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                          <School size={14} className="text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            {video.class.name} - {video.class.location}
                          </span>
                        </div>
                      )}
                      {video.year && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/50 rounded-full">
                          <GraduationCap size={14} className="text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            {video.year.name}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-sm theme-text-secondary mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                  </div>
                </div>

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
                </div>
              </div>

              <div className="flex items-center justify-between p-4 theme-bg-secondary rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold theme-text-primary">
                      {video.uploadedBy?.username || "Unknown"}
                    </h3>
                    <p className="text-sm theme-text-secondary capitalize">
                      ICT A-Level User
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium theme-text-primary">
                    Video {progress.current} of {progress.total}
                  </p>
                  {video.class && video.year && (
                    <p className="text-xs theme-text-tertiary">
                      {video.class.name} - {video.year.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t theme-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold theme-text-primary">
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
                  <div className="theme-bg-secondary rounded-lg p-4">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap theme-text-secondary text-sm leading-relaxed">
                        {video.description}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 theme-bg-primary theme-border-l">
          <div className="sticky top-16 max-h-screen overflow-y-auto">
            <div className="p-4 theme-border-b theme-bg-secondary">
              <div className="flex items-center gap-2 mb-2">
                <Link href="/student/videos">
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
              <h2 className="font-semibold theme-text-primary">
                {video.class
                  ? `${video.class.name} - ${video.class.location}`
                  : "ICT A-Level Lessons"}
              </h2>
              <p className="text-sm theme-text-secondary">
                AL ICT / ezyICT Platform{" "}
                {video.year ? `${video.year.name} ` : ""}
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/50 theme-border-b">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Currently Watching
                </span>
              </div>
              <h4 className="font-medium theme-text-primary text-sm line-clamp-2">
                {video.title}
              </h4>
            </div>

            <div className="p-4">
              <h3 className="font-semibold theme-text-primary mb-4">Next Lessons</h3>

              <div className="space-y-3">
                {relatedVideos.map((relatedVideo, index) => (
                  <Link
                    href={`/student/videos/${relatedVideo._id}`}
                    key={relatedVideo._id}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-3 transition-colors theme-border"
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <video
                          className="w-20 h-14 bg-gray-200 dark:bg-gray-700 rounded object-cover"
                          preload="metadata"
                        >
                          <source
                            src={`${API_BASE_URL}/uploads/${relatedVideo.videoUrl}`}
                          />
                        </video>
                        <div className="absolute top-1 left-1 bg-gray-900 text-white text-xs px-1 rounded">
                          {index + 2}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium theme-text-primary text-sm line-clamp-2 mb-1">
                          {relatedVideo.title}
                        </h4>
                        <p className="text-xs theme-text-tertiary mb-1">
                          {relatedVideo.uploadedBy?.username || "Unknown"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                          <span>{formatDateShort(relatedVideo.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  Your Progress
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-green-200 dark:bg-green-800 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-green-700 dark:text-green-300">
                    {progress.percentage}%
                  </span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {progress.current} of {progress.total} lessons completed
                </p>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen size={16} className="mr-2" />
                  Take Notes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
