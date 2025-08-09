"use client"; 
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  Video,
  Plus,
  Play,
  Search,
  User,
  Calendar,
  School,
  GraduationCap,
  Eye,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  Users,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";

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
  _id: string;
  username: string;
  role: "student" | "teacher" | "admin";
  firstName?: string;
  lastName?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      const response = await axios.get("http://localhost:5000/api/videos", {
        headers: getAuthHeaders(),
      });
      setVideos(response.data.videos || response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || "User";
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

  if (!user) {
    return null;
  }

  const isStudent = user.role === "student";
  const isTeacher = user.role === "teacher";

  // Filter videos for students vs teachers
  const filteredVideos = videos.filter((video) => {
  const matchesSearch =
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

  // No filtering by uploader - everyone sees all matching videos
  return matchesSearch;
});

// Show only latest 5 videos sorted by createdAt descending
const latestVideos = [...filteredVideos]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);

  const recentVideos = filteredVideos.slice(0, 6);

  // Calculate statistics
  const totalViews = isTeacher 
    ? filteredVideos.reduce((sum, video) => sum + (video.views || 0), 0)
    : 0;

  const uniqueClasses = [...new Set(videos.filter((v) => v.class).map((v) => v.class!._id))].length;
  const uniqueYears = [...new Set(videos.filter((v) => v.year).map((v) => v.year!._id))].length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {getDisplayName()}! 👋
                  </h1>
                  <p className="text-gray-600">
                    {isStudent 
                      ? "Ready to continue your ICT A-Level journey?"
                      : "Manage your video content and track student engagement"
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isTeacher ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                }`}>
                  {isTeacher ? <GraduationCap size={16} /> : <School size={16} />}
                  {user.role.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards - Role Based */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {isStudent ? (
            // Student Statistics
            <>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Video className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Videos</p>
                    <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subjects</p>
                    <p className="text-2xl font-bold text-gray-900">{uniqueClasses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hours Watched</p>
                    <p className="text-2xl font-bold text-gray-900">24.5hrs</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Award className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Progress</p>
                    <p className="text-2xl font-bold text-gray-900">85%</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Teacher Statistics
            <>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Video className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">My Videos</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredVideos.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Eye className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Students Reached</p>
                    <p className="text-2xl font-bold text-gray-900">127</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg. Engagement</p>
                    <p className="text-2xl font-bold text-gray-900">92%</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Search Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isStudent ? "Continue Learning" : "Content Overview"}
                </h2>
                {isTeacher && (
                  <Link href="/videos">
                    <Button size="sm" className="flex items-center gap-2">
                      <Plus size={16} />
                      Upload Video
                    </Button>
                  </Link>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  placeholder={isStudent ? "Search lessons..." : "Search your videos..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Recent Videos */}
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentVideos.slice(0, 4).map((video) => (
                    <div
                      key={video._id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-16 h-12 bg-gray-900 rounded flex items-center justify-center">
                        <Play size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {video.class && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {video.class.name}
                            </span>
                          )}
                          {isTeacher && (
                            <span className="flex items-center gap-1">
                              <Eye size={12} />
                              {video.views || 0} views
                            </span>
                          )}
                          <span>{formatDate(video.createdAt)}</span>
                        </div>
                      </div>
                      <Link href={`/videos/${video._id}`}>
                        <Button size="sm" variant="outline">
                          {isStudent ? "Watch" : "View"}
                        </Button>
                      </Link>
                    </div>
                  ))}

                  {recentVideos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Video size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>
                        {isStudent 
                          ? "No videos available yet" 
                          : "Upload your first video to get started"
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              {recentVideos.length > 4 && (
                <div className="mt-4 text-center">
                  <Link href="/videos">
                    <Button variant="outline" size="sm">
                      View All Videos
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links Sidebar */}
          <div className="space-y-6">
            {/* Quick Navigation */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Access</h3>
              <div className="space-y-3">
                <Link href="/videos" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Video size={20} className="text-blue-600" />
                    <span className="font-medium">
                      {isStudent ? "All Videos" : "Manage Videos"}
                    </span>
                  </div>
                </Link>

                <Link href="/profile" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <User size={20} className="text-green-600" />
                    <span className="font-medium">My Profile</span>
                  </div>
                </Link>

                {isTeacher && (
                  <Link href="/analytics" className="block">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <BarChart3 size={20} className="text-purple-600" />
                      <span className="font-medium">Analytics</span>
                    </div>
                  </Link>
                )}

                {isStudent && (
                  <Link href="/progress" className="block">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <TrendingUp size={20} className="text-orange-600" />
                      <span className="font-medium">My Progress</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {isStudent ? "Learning Activity" : "Recent Activity"}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {isStudent 
                      ? "Completed Database Fundamentals"
                      : "Video uploaded: React Basics"
                    }
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {isStudent 
                      ? "Started Python Programming"
                      : "Student watched your video"
                    }
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {isStudent 
                      ? "Assignment submitted"
                      : "New comment on video"
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
