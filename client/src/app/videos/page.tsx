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
  Eye,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";

interface VideoData {
  _id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail?: string;
  videoUrl: string;
  course: string;
  views: number;
  uploadedAt: string;
  uploadedBy: string;
}

export default function VideoManagementPage() {
  const [user, setUser] = useState({ username: "teacher_smith", role: "teacher" as const });
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/videos");
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (videoData: Omit<VideoData, '_id' | 'views' | 'uploadedAt' | 'uploadedBy'>) => {
    try {
      const response = await axios.post("http://localhost:5000/api/videos", videoData);
      setVideos([response.data, ...videos]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const handleUpdateVideo = async (videoData: VideoData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/videos/${videoData._id}`, videoData);
      setVideos(videos.map(video => 
        video._id === videoData._id ? response.data : video
      ));
      setEditingVideo(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/videos/${videoId}`);
      setVideos(videos.filter(video => video._id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const openEditForm = (video: VideoData) => {
    setEditingVideo(video);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingVideo(null);
    setIsFormOpen(true);
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "all" || video.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const courses = ["all", ...Array.from(new Set(videos.map(video => video.course)))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Video Management</h1>
            <p className="text-gray-600">Manage your course videos and content</p>
          </div>
          <Button onClick={openAddForm} className="flex items-center gap-2">
            <Plus size={20} />
            Add New Video
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {courses.map(course => (
                  <option key={course} value={course}>
                    {course === "all" ? "All Courses" : course}
                  </option>
                ))}
              </select>
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
              <div key={video._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Video className="text-gray-400" size={48} />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Link href={`/videos/${video._id}`}>
                      <Button size="sm" className="flex items-center gap-2">
                        <Play size={16} />
                        Watch
                      </Button>
                    </Link>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {video.course}
                    </span>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {video.views}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/videos/${video._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Play size={16} className="mr-1" />
                        View
                      </Button>
                    </Link>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredVideos.length === 0 && !loading && (
          <div className="text-center py-12">
            <Video className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600 mb-6">Start by adding your first video content</p>
            <Button onClick={openAddForm}>
              <Plus size={20} className="mr-2" />
              Add New Video
            </Button>
          </div>
        )}
      </main>

      {/* Video Form Modal */}
      {isFormOpen && (
        <VideoForm
          video={editingVideo}
          onSave={editingVideo ? handleUpdateVideo : handleAddVideo}
          onClose={() => {
            setIsFormOpen(false);
            setEditingVideo(null);
          }}
        />
      )}
    </div>
  );
}
