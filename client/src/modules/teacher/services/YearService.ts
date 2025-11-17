import { api as ApiClient } from '@/lib/api-client';
import { YearData } from '../types/year.types';

export class TeacherYearService {
  static async getYears(): Promise<YearData[]> {
    const response = await ApiClient.get<{ years: YearData[] }>('/years');
    return response.data.years || [];
  }

  static async createYear(yearData: { year: string; name: string }): Promise<YearData> {
    const response = await ApiClient.post<YearData>('/years', yearData);
    return response.data;
  }

  static async updateYear(id: string, yearData: { year: string; name: string }): Promise<YearData> {
    const response = await ApiClient.put<YearData>(`/years/${id}`, yearData);
    return response.data;
  }

  static async deleteYear(id: string): Promise<void> {
    await ApiClient.delete<void>(`/years/${id}`);
  }
}
