import { useState, useEffect } from 'react';
import { isAxiosError } from '../../../lib/utils/error';
import { TeacherVideoService } from '../services/VideoService';
import { VideoData } from '../../shared/types/video.types';

interface UseTeacherVideosReturn {
  videos: VideoData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
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
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch videos';
      if (isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error fetching teacher videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchVideos();
    } else {
      setIsLoading(false); // Assume not loading on server
    }
  }, []);

  return {
    videos,
    isLoading,
    error,
    refetch: fetchVideos,
  };
};
