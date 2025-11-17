import { useState, useEffect } from 'react';
import { TeacherDashboardService } from '../services/dashboardService';
import { TeacherDashboardData } from '../types/dashboard.types';
import { isAxiosError } from '@/lib/utils/error'; // Import isAxiosError

interface UseTeacherDashboardReturn {
  data: TeacherDashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTeacherDashboard = (): UseTeacherDashboardReturn => {
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dashboardData = await TeacherDashboardService.getDashboard();
      setData(dashboardData);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch dashboard data';
      if (isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error fetching teacher dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
};