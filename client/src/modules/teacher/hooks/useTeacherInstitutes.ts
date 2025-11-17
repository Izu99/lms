"use client";

import { useState, useEffect } from 'react';
import { isAxiosError } from '../../../lib/utils/error';
import { TeacherInstituteService } from '../services/InstituteService';
import { InstituteData } from '../types/institute.types';

interface UseTeacherInstitutesReturn {
  institutes: InstituteData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherInstitutes = (): UseTeacherInstitutesReturn => {
  const [institutes, setInstitutes] = useState<InstituteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstitutes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const instituteData = await TeacherInstituteService.getInstitutes();
      setInstitutes(instituteData);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch institutes';
      if (isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error fetching teacher institutes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchInstitutes();
    } else {
      setIsLoading(false); // Assume not loading on server
    }
  }, []);

  return {
    institutes,
    isLoading,
    error,
    refetch: fetchInstitutes,
  };
};
