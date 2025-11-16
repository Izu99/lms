import { useState, useEffect } from 'react';
import { TeacherYearService } from '../services/YearService';
import { YearData } from '../types/year.types';

interface UseTeacherYearsReturn {
  years: YearData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch academic years');
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
