"use client";

import { useState, useEffect, useCallback } from 'react';
import { api as ApiClient } from '@/lib/api-client';
import { InstituteData } from '@/modules/shared/types/institute.types'; // Assuming InstituteData type exists

interface UseInstitutesReturn {
  institutes: InstituteData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useInstitutes = (): UseInstitutesReturn => {
  const [institutes, setInstitutes] = useState<InstituteData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstitutes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming an API endpoint for fetching all institutes
      const response = await ApiClient.get<{ institutes: InstituteData[] }>('/institutes');
      console.log('Fetched institutes:', response.data.institutes); // Log fetched data
      setInstitutes(response.data.institutes || []);
    } catch (err: any) {
      console.error('Error fetching institutes:', err); // Log errors
      setError(err.response?.data?.message || 'Failed to fetch institutes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstitutes();
  }, [fetchInstitutes]);

  return { institutes, isLoading, error, refetch: fetchInstitutes };
};