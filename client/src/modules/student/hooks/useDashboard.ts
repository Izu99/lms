import { useState, useEffect } from 'react';
import { StudentDashboardService } from '../services/dashboardService';
import { StudentDashboardData } from '../types/dashboard.types';
import { isAxiosError } from '@/lib/utils/error'; // Import isAxiosError

interface UseDashboardReturn {
  data: StudentDashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStudentDashboard = (): UseDashboardReturn => {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dashboardData = await StudentDashboardService.getDashboard();
      setData(dashboardData);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch dashboard data';
      if (isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error fetching student dashboard:', err);
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