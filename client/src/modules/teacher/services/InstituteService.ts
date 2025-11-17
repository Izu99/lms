import { api as ApiClient } from '@/lib/api-client';
import { InstituteData } from '../types/institute.types';

export class TeacherInstituteService {
  static async getInstitutes(): Promise<InstituteData[]> {
    const response = await ApiClient.get<{ institutes: InstituteData[] }>('/institutes');
    return response.data.institutes || [];
  }

  static async createInstitute(instituteData: { name: string; location: string }): Promise<InstituteData> {
    const response = await ApiClient.post<InstituteData>('/institutes', instituteData);
    return response.data;
  }

  static async updateInstitute(id: string, instituteData: { name: string; location: string }): Promise<InstituteData> {
    const response = await ApiClient.put<InstituteData>(`/institutes/${id}`, instituteData);
    return response.data;
  }

  static async deleteInstitute(id: string): Promise<void> {
    await ApiClient.delete<void>(`/institutes/${id}`);
  }
}
