"use client";

import { useState, useEffect, useCallback } from 'react';
import { isAxiosError } from '../../../lib/utils/error';
import { ZoomService } from '../../shared/services/ZoomService'; // Still using ZoomService for now
import { ZoomLinkData } from '../../shared/types/zoom.types'; // Still using ZoomLinkData for now

interface UseStudentMeetingReturn {
  meetingLinks: ZoomLinkData[]; // Changed to meetingLinks
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStudentMeeting = (): UseStudentMeetingReturn => { // Changed hook name
  const [meetingLinks, setMeetingLinks] = useState<ZoomLinkData[]>([]); // Changed to meetingLinks
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetingLinks = useCallback(async () => { // Changed function name
    try {
      setIsLoading(true);
      setError(null);
      const meetingLinkData = await ZoomService.getZoomLinks(); // Still using getZoomLinks for now
      setMeetingLinks(meetingLinkData); // Changed to meetingLinks
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch meeting links'; // Changed error message
      if (isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error fetching student meeting links:', err); // Changed log message
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetingLinks(); // Changed function name
  }, [fetchMeetingLinks]);

  return {
    meetingLinks, // Changed to meetingLinks
    isLoading,
    error,
    refetch: fetchMeetingLinks, // Changed function name
  };
};