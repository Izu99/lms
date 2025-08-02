'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Play, Clock, Eye, MoreVertical, Search, Filter, Grid, List } from 'lucide-react';

export default function VideoManagement() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { token } = useAuth();

  useEffect(() => {
    fetchVideos();
  }, [token]);

  const fetchVideos = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/videos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError('Please select a video file.');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);

    try {
      const res = await fetch('http://localhost:5000/api/videos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        await fetchVideos();
        setTitle('');
        setDescription('');
        setVideoFile(null);
        setIsDialogOpen(false);
      } else {
        const data = await res.json();
        setError(data.message || 'Upload failed');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const VideoCard = ({ video }: { video: any }) => (
    <Card className="bg-white border-slate-200 hover:border-blue-300 transition-all duration-200">
      <div className="relative aspect-video bg-slate-100">
        <video
          src={`http://localhost:5000/${video.filePath}`}
          className="w-full h-full object-contain bg-slate-100 transition-transform duration-300"
          muted
          onMouseEnter={(e) => {
            const target = e.target as HTMLVideoElement;
            target.currentTime = 5;
          }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white backdrop-blur-sm border border-blue-500"
            onClick={() => window.location.href = `/videos/${video.id}`}
          >
            <Play className="w-6 h-6 mr-2" />
            Watch Now
          </Button>
        </div>
        <div className="absolute top-3 left-3">
          <Badge className="bg-slate-900 text-white border border-slate-700">
            HD
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button size="sm" variant="ghost" className="text-slate-700 hover:bg-slate-100 h-8 w-8 p-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h3>
        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
          {video.description || 'No description available'}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {Math.floor(Math.random() * 1000)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.floor(Math.random() * 24)}h ago
            </span>
          </div>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs">
            {Math.floor(Math.random() * 100 + 10)}MB
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Video Management
              </h1>
              <p className="text-slate-600">
                Upload, organize, and manage your video collection
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-sm border-slate-200 text-slate-900">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Upload New Video
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Video Title
                    </label>
                    <Input
                      placeholder="Enter video title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe your video..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Video File
                    </label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                        className="bg-slate-50 border-slate-200 text-slate-900 file:bg-blue-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <div className="flex rounded-lg bg-slate-100 p-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className={`px-3 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className={`px-3 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Total Videos</p>
                  <p className="text-2xl font-bold text-slate-900">{videos.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Play className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-slate-900">{videos.length * Math.floor(Math.random() * 100 + 50)}</p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Eye className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Storage Used</p>
                  <p className="text-2xl font-bold text-slate-900">{Math.floor(videos.length * 45)}MB</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-12 text-center">
              <div className="text-slate-400 text-6xl mb-4">📹</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Videos Found</h3>
              <p className="text-slate-600 mb-6">
                {searchTerm ? 'No videos match your search criteria.' : 'Upload your first video to get started.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}