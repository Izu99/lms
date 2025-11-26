"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ZoomService } from "@/modules/shared/services/ZoomService";
import { isAxiosError } from '../../../lib/utils/error';
import { ZoomLinkData } from '@/modules/shared/types/zoom.types';

interface UseTeacherZoomReturn {
  zoomLinks: ZoomLinkData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherZoom = (
  instituteId?: string,
  yearId?: string,
  academicLevelId?: string
): UseTeacherZoomReturn => {
  const [zoomLinks, setZoomLinks] = useState<ZoomLinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchZoomLinks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const zoomLinkData = await ZoomService.getZoomLinks(instituteId, yearId, academicLevelId);
      setZoomLinks(zoomLinkData);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch zoom links';
      if (isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error fetching teacher zoom links:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchZoomLinks();
  }, [instituteId, yearId, academicLevelId]);

  return {
    zoomLinks,
    isLoading,
    error,
    refetch: fetchZoomLinks,
  };
};
