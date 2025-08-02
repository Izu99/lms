'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Clock, Eye, Download, Share2, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function VideoPage() {
  const params = useParams();
  const id = params.id as string;
  const [video, setVideo] = useState<any>(null);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id || !token) return;
      
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/videos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setVideo(data);
        } else {
          const data = await res.json();
          setError(data.message || 'Failed to fetch video');
        }
      } catch (error) {
        setError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchVideo();
    }
  }, [token, id]);

  const handlePlayPause = () => {
    const videoElement = document.getElementById('main-video') as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    const videoElement = document.getElementById('main-video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    const videoElement = document.getElementById('main-video') as HTMLVideoElement;
    if (videoElement && videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="bg-white border border-red-200">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Video</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => window.history.back()} 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Videos
            </Button>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
              HD Quality
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Container */}
            <div className="relative group">
              <div className="relative bg-black rounded-lg overflow-hidden shadow-lg aspect-video border border-gray-200">
                <video
                  id="main-video"
                  src={`http://localhost:5000/${video.filePath}`}
                  className="w-full h-full object-contain"
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Custom Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handlePlayPause}
                        className="text-white hover:bg-white/20 h-10 w-10 p-0"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleMuteToggle}
                        className="text-white hover:bg-white/20 h-10 w-10 p-0"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleFullscreen}
                      className="text-white hover:bg-white/20 h-10 w-10 p-0"
                    >
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {video.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{video.views || Math.floor(Math.random() * 1000)} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 24)} hours ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Description Card */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {video.description || 'No description available for this video.'}
                </p>
              </CardContent>
            </Card>

            {/* Video Details Card */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Duration</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {video.duration || `${Math.floor(Math.random() * 20 + 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Quality</span>
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      HD
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Size</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {Math.floor(Math.random() * 100 + 20)}MB
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Format</span>
                    <span className="text-gray-900 text-sm font-medium">MP4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download Video
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Video
                  </Button>
                  <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
                    <Flag className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress Card */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-medium">35% Complete</span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                      Mark as Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}