"use client";

import { useState, useEffect, useCallback } from 'react';
import { api as ApiClient } from '@/lib/api-client';
import { InstituteData } from '@/modules/shared/types/institute.types'; // Assuming InstituteData type exists
import { AxiosError } from 'axios';

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
      const response = await ApiClient.get<{ institutes: InstituteData[] }>('/institutes');
      setInstitutes(response.data.institutes || []);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Error fetching institutes:', error); // Log errors
      setError(error.response?.data?.message || 'Failed to fetch institutes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstitutes();
  }, [fetchInstitutes]);

  return { institutes, isLoading, error, refetch: fetchInstitutes };
};