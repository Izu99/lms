"use client";

import { useState, useEffect, useCallback } from 'react';
import { api as ApiClient } from '@/lib/api-client';
import { VideoData } from '@/modules/shared/types/video.types'; // Assuming VideoData type exists

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
      // Assuming an API endpoint for fetching all videos
      const response = await ApiClient.get<{ videos: VideoData[] }>('/videos');
      console.log('Fetched videos:', response.data.videos); // Log fetched data
      setVideos(response.data.videos || []);
    } catch (err: any) {
      console.error('Error fetching videos:', err); // Log errors
      setError(err.response?.data?.message || 'Failed to fetch videos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { videos, isLoading, error, refetch: fetchVideos };
};
