"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import Link from "next/link";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Video, Eye, Clock } from "lucide-react"; // Import icons

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  views: number;
  uploadedBy: {
    username: string;
  };
  class?: {
    name: string;
  };
}

interface VideoStats {
  totalVideos: number;
  totalWatchedCount: number;
  totalWatchTime: number; // in seconds
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoStats, setVideoStats] = useState<VideoStats | null>(null);

  useEffect(() => {
    const fetchVideosAndStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const videoResponse = await axios.get(`${API_URL}/videos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(videoResponse.data.videos);

        const statsResponse = await axios.get(`${API_URL}/student/video-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideoStats(statsResponse.data);

      } catch (error) {
        console.error("Error fetching videos or stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideosAndStats();
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div>
        <h1 className="text-3xl font-bold theme-text-primary mb-8">Video Lessons</h1>

        {videoStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="theme-bg-primary rounded-lg shadow-sm theme-border p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <Video size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm theme-text-secondary">Total Videos</p>
                <p className="text-2xl font-bold theme-text-primary">{videoStats.totalVideos}</p>
              </div>
            </div>
            <div className="theme-bg-primary rounded-lg shadow-sm theme-border p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <Eye size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm theme-text-secondary">Videos Watched</p>
                <p className="text-2xl font-bold theme-text-primary">{videoStats.totalWatchedCount}</p>
              </div>
            </div>
            <div className="theme-bg-primary rounded-lg shadow-sm theme-border p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm theme-text-secondary">Total Watch Time</p>
                <p className="text-2xl font-bold theme-text-primary">{formatTime(videoStats.totalWatchTime)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link href={`/student/videos/${video._id}`} key={video._id}>
              <div className="theme-bg-primary rounded-lg shadow-sm theme-border overflow-hidden transform transition-transform duration-300 hover:scale-105">
                <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-2xl">▶</span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium theme-text-primary truncate">{video.title}</h3>
                  <p className="text-sm theme-text-secondary truncate">
                    {video.class?.name && `${video.class.name} • `}{video.views} views
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
