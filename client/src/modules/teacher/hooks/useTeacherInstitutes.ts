import { useState, useEffect } from 'react';
import { TeacherInstituteService } from '../services/InstituteService';
import { InstituteData } from '../types/institute.types';

interface UseTeacherInstitutesReturn {
  institutes: InstituteData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch institutes');
      console.error('Error fetching teacher institutes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutes();
  }, []);

  return {
    institutes,
    isLoading,
    error,
    refetch: fetchInstitutes,
  };
};
