import { useState, useEffect } from 'react';
import { TeacherZoomService } from '../../shared/services/ZoomService';
import { ZoomLinkData } from '../../shared/types/zoom.types';

interface UseTeacherZoomReturn {
  zoomLinks: ZoomLinkData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTeacherZoom = (): UseTeacherZoomReturn => {
  const [zoomLinks, setZoomLinks] = useState<ZoomLinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchZoomLinks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const zoomLinkData = await TeacherZoomService.getZoomLinks();
      setZoomLinks(zoomLinkData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch zoom links');
      console.error('Error fetching teacher zoom links:', err);
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
