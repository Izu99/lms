'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import VideoGrid from '@/components/video/VideoGrid';

export default function VideoManagement() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
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

    if (token) {
      fetchVideos();
    }
  }, [token]);

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
        // Refresh videos list
        const fetchVideos = async () => {
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
        fetchVideos();
        setTitle('');
        setDescription('');
        setVideoFile(null);
      } else {
        const data = await res.json();
        setError(data.message || 'Upload failed');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Videos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Upload Video</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload a new video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Video Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                type="file"
                onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
              />
              {error && <p className="text-red-500">{error}</p>}
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <VideoGrid videos={videos} />
    </div>
  );
}