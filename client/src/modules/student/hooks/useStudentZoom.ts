"use client";

import { useState, useEffect } from 'react';
import { isAxiosError } from '../../../lib/utils/error';
import { ZoomService } from '../../shared/services/ZoomService';
import { ZoomLinkData } from '../../shared/types/zoom';

interface UseStudentZoomReturn {
  zoomLinks: ZoomLinkData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStudentZoom = (): UseStudentZoomReturn => {
  const [zoomLinks, setZoomLinks] = useState<ZoomLinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchZoomLinks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const zoomLinkData = await ZoomService.getZoomLinks();
      setZoomLinks(zoomLinkData);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch zoom links';
      if (isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error fetching student zoom links:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchZoomLinks();
  }, []);

  return {
    zoomLinks,
    isLoading,
    error,
    refetch: fetchZoomLinks,
  };
};
