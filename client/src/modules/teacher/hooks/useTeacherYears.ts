"use client";

import { useState, useEffect } from 'react';
import { isAxiosError } from '../../../lib/utils/error';
import { TeacherYearService } from '../services/YearService';
import { YearData } from '../types/year.types';

interface UseTeacherYearsReturn {
  years: YearData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherYears = (): UseTeacherYearsReturn => {
  const [years, setYears] = useState<YearData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchYears = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const yearData = await TeacherYearService.getYears();
      setYears(yearData);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch academic years';
      if (isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error fetching teacher years:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  return {
    years,
    isLoading,
    error,
    refetch: fetchYears,
  };
};
