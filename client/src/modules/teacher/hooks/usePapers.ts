"use client";

import { useState, useEffect, useCallback } from 'react';
import { api as ApiClient } from '@/lib/api-client';
import { PaperData } from '@/modules/shared/types/paper.types'; // Assuming PaperData type exists
import { AxiosError } from 'axios';

interface UsePapersReturn {
  papers: PaperData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePapers = (): UsePapersReturn => {
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPapers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiClient.get<{ papers: PaperData[] }>('/papers');
      setPapers(response.data.papers || []);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Error fetching papers:', error); // Log errors
      setError(error.response?.data?.message || 'Failed to fetch papers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  return { papers, isLoading, error, refetch: fetchPapers };
};