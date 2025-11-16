import { useState, useEffect } from 'react';
import { TeacherVideoService } from '../services/VideoService';
import { VideoData } from '../types/video.types';

interface UseTeacherVideosReturn {
  videos: VideoData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTeacherVideos = (): UseTeacherVideosReturn => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const videoData = await TeacherVideoService.getVideos();
      setVideos(videoData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch videos');
      console.error('Error fetching teacher videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    isLoading,
    error,
    refetch: fetchVideos,
  };
};
