"use client";

import { useState, useEffect, useCallback } from 'react';
import { CoursePackageData } from '../../shared/types/course-package.types';
import { api as ApiClient } from '@/lib/api-client';
import { AxiosError } from 'axios';

interface UseStudentCoursePackagesReturn {
  coursePackages: CoursePackageData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useStudentCoursePackages = (): UseStudentCoursePackagesReturn => {
  const [coursePackages, setCoursePackages] = useState<CoursePackageData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoursePackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiClient.get<{ coursePackages: CoursePackageData[] }>('/course-packages');
      setCoursePackages(response.data.coursePackages || []);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Error fetching student course packages:', error);
      setError(error.response?.data?.message || 'Failed to fetch course packages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoursePackages();
  }, [fetchCoursePackages]);

  return { coursePackages, isLoading, error, refetch: fetchCoursePackages };
};