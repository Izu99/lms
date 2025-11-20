"use client";

import { useState, useEffect, useCallback } from 'react';
import { CoursePackageData } from '../../shared/types/course-package.types';
import { CoursePackageService } from '../services/CoursePackageService';
import { AxiosError } from 'axios';

interface UseCoursePackagesReturn {
  coursePackages: CoursePackageData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCoursePackages = (): UseCoursePackagesReturn => {
  const [coursePackages, setCoursePackages] = useState<CoursePackageData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoursePackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await CoursePackageService.getCoursePackages();
      setCoursePackages(data || []);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error('Error fetching course packages:', error); // Log errors
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
