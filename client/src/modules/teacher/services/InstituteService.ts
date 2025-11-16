import { ApiClient } from '../../shared/utils/api';
import { InstituteData } from '../types/institute.types';

export class TeacherInstituteService {
  static async getInstitutes(): Promise<InstituteData[]> {
    const response = await ApiClient.get<{ institutes: InstituteData[] }>('/institutes');
    return response.institutes || [];
  }

  static async createInstitute(instituteData: { name: string; location: string }): Promise<InstituteData> {
    return ApiClient.post<InstituteData>('/institutes', instituteData);
  }

  static async updateInstitute(id: string, instituteData: { name: string; location: string }): Promise<InstituteData> {
    return ApiClient.put<InstituteData>(`/institutes/${id}`, instituteData);
  }

  static async deleteInstitute(id: string): Promise<void> {
    return ApiClient.delete<void>(`/institutes/${id}`);
  }
}
