"use client";

import { useState, useEffect } from "react";
import { StudentService } from "../services/StudentService"; // Corrected import
import { StudentData } from "../types/student.types";
import { isAxiosError } from '../../../lib/utils/error';

interface UseTeacherStudentsReturn {
  students: StudentData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTeacherStudents = (): UseTeacherStudentsReturn => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const studentData = await StudentService.getStudents(); // Corrected service call
      setStudents(studentData);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch students';
      if (isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      console.error('Error fetching teacher students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    isLoading,
    error,
    refetch: fetchStudents,
  };
};
