"use client";

import { useState, useEffect } from 'react';
import { isAxiosError } from '../../../lib/utils/error';
import { TeacherPaperService } from '../services/PaperService';
import { PaperData } from '../types/paper.types';

interface UseTeacherPapersReturn {
  papers: PaperData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherPapers = (
  instituteId?: string,
  yearId?: string,
  academicLevelId?: string
): UseTeacherPapersReturn => {
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const paperData = await TeacherPaperService.getPapers(instituteId, yearId, academicLevelId);
      setPapers(paperData);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch papers';
      if (isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error fetching teacher papers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [instituteId, yearId, academicLevelId]); // Add dependencies

  return {
    papers,
    isLoading,
    error,
    refetch: fetchPapers,
  };
};
