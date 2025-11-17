"use client";

import { useState, useEffect, useCallback } from 'react';
import { api as ApiClient } from '@/lib/api-client';
import { YearData } from '@/modules/shared/types/year.types'; // Assuming YearData type exists
import { AxiosError } from 'axios';

interface UseYearsReturn {
  years: YearData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useYears = (): UseYearsReturn => {
  const [years, setYears] = useState<YearData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchYears = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiClient.get<{ years: YearData[] }>('/years');
      setYears(response.data.years || []);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Error fetching years:', error); // Log errors
      setError(error.response?.data?.message || 'Failed to fetch years');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  return { years, isLoading, error, refetch: fetchYears };
};