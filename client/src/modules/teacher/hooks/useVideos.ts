"use client";

import { useState, useEffect, useCallback } from 'react';
import { api as ApiClient } from '@/lib/api-client';
import { VideoData } from '@/modules/shared/types/video.types'; // Assuming VideoData type exists
import { AxiosError } from 'axios';

interface UseVideosReturn {
  videos: VideoData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useVideos = (): UseVideosReturn => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiClient.get<{ videos: VideoData[] }>('/videos');
      setVideos(response.data.videos || []);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Error fetching videos:', error); // Log errors
      setError(error.response?.data?.message || 'Failed to fetch videos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { videos, isLoading, error, refetch: fetchVideos };
};
