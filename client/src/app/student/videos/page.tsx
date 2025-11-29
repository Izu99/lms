"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, API_BASE_URL } from "@/lib/constants";
import Link from "next/link";
import { StudentLayout } from "@/components/student/StudentLayout";
import { Video, Eye, Clock, Plus, Search, Play, School, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { EmptyStateComponent } from "@/components/common/EmptyStateComponent";
import { Pagination } from "@/components/ui/pagination";
import CommonFilter from "@/components/common/CommonFilter";
import { StudentGridSkeleton } from "@/components/student/skeletons/StudentGridSkeleton";
import { useStudentFilters } from "@/modules/student/hooks/useStudentFilters";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  uploadedBy: {
    username: string;
  };
  class?: {
    name: string;
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
}

interface VideoStats {
  totalVideos: number;
  totalWatchedCount: number;
  totalWatchTime: number; // in seconds
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoStats, setVideoStats] = useState<VideoStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 9;

  // Filter states
  const [selectedInstitute, setSelectedInstitute] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState<string>("all");
  const { institutes, years, academicLevels, isLoadingInstitutes, isLoadingYears, isLoadingAcademicLevels } = useStudentFilters();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchVideosAndStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const videoResponse = await axios.get(`${API_URL}/videos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(videoResponse.data.videos);

        const statsResponse = await axios.get(`${API_URL}/student/video-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideoStats(statsResponse.data);

      } catch (err) {
        console.error("Error fetching videos or stats:", err);
        setError("Failed to load videos. Please try again.");
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

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInstitute = selectedInstitute === "all" || video.institute?._id === selectedInstitute;
    const matchesYear = selectedYear === "all" || video.year?._id === selectedYear;
    // Academic level filtering can be added when backend supports it
    return matchesSearch && matchesInstitute && matchesYear;
  });

  // Pagination Logic
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const paginatedVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  if (loading) {
    return (
      <StudentLayout>
        <StudentGridSkeleton />
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <ErrorComponent message={error} onRetry={() => setError(null)} />
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl font-bold theme-text-primary mb-6 sm:mb-8">Video Lessons</h1>

        {/* Filter Component */}
        <CommonFilter
          institutes={institutes}
          years={years}
          academicLevels={academicLevels}
          selectedInstitute={selectedInstitute}
          selectedYear={selectedYear}
          selectedAcademicLevel={selectedAcademicLevel}
          onInstituteChange={setSelectedInstitute}
          onYearChange={setSelectedYear}
          onAcademicLevelChange={setSelectedAcademicLevel}
          isLoadingInstitutes={isLoadingInstitutes}
          isLoadingYears={isLoadingYears}
          isLoadingAcademicLevels={isLoadingAcademicLevels}
        />

        {/* Search Bar */}
        <div className="theme-bg-primary rounded-xl shadow-md theme-border p-4 mb-8">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 theme-text-tertiary" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm bg-transparent theme-text-primary placeholder:theme-text-tertiary"
            />
          </div>
        </div>

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

        {filteredVideos.length === 0 ? (
          <EmptyStateComponent
            Icon={Video}
            title={searchQuery ? "No videos found" : "No videos yet"}
            description={
              searchQuery
                ? "Try a different search term"
                : "There are no videos available for you at the moment."
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedVideos.map((video, index) => (
                <Link href={`/student/videos/${video._id}`} key={video._id}>
                  <div
                    className="theme-bg-primary rounded-xl shadow-md theme-border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{
                      animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div className="relative w-full h-48 bg-gray-900 cursor-pointer group overflow-hidden">
                      {video.thumbnailUrl ? (
                        <img
                          src={`${API_BASE_URL}${video.thumbnailUrl}`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={`${API_BASE_URL}/uploads/${video.videoUrl}`}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg opacity-0 group-hover:opacity-100">
                          <Play size={32} className="text-white" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        Click to watch
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold theme-text-primary mb-2 truncate">
                        {video.title}
                      </h3>
                      <p className="text-sm theme-text-secondary mb-3 line-clamp-2 min-h-[40px]">
                        {video.description || "No description"}
                      </p>

                      <div className="flex items-center gap-4 mb-3">
                        {video.institute && (
                          <div className="flex items-center gap-2 text-xs theme-text-secondary">
                            <School className="w-4 h-4 text-purple-500" />
                            <span>{video.institute.name}</span>
                          </div>
                        )}
                        {video.year && (
                          <div className="flex items-center gap-2 text-xs theme-text-secondary">
                            <GraduationCap className="w-4 h-4 text-blue-500" />
                            <span>{video.year.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </StudentLayout>
  );
}
