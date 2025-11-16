import { useState, useEffect } from 'react';
import { TeacherStudentService } from '../services/StudentService';
import { StudentData } from '../types/student.types';

interface UseTeacherStudentsReturn {
  students: StudentData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTeacherStudents = (): UseTeacherStudentsReturn => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const studentData = await TeacherStudentService.getStudents();
      setStudents(studentData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch students');
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
