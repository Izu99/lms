import { ApiClient } from '../../shared/utils/api';
import { StudentData } from '../types/student.types';

export class TeacherStudentService {
  static async getStudents(): Promise<StudentData[]> {
    const response = await ApiClient.get<{ students: StudentData[] }>('/auth/students');
    return response.students || [];
  }
}
