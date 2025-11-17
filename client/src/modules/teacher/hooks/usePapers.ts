"use client";

import { useState, useEffect, useCallback } from 'react';
import { api as ApiClient } from '@/lib/api-client';
import { PaperData } from '@/modules/shared/types/paper.types'; // Assuming PaperData type exists

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
      // Assuming an API endpoint for fetching all papers
      const response = await ApiClient.get<{ papers: PaperData[] }>('/papers');
      console.log('Fetched papers:', response.data.papers); // Log fetched data
      setPapers(response.data.papers || []);
    } catch (err: any) {
      console.error('Error fetching papers:', err); // Log errors
      setError(err.response?.data?.message || 'Failed to fetch papers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  return { papers, isLoading, error, refetch: fetchPapers };
};