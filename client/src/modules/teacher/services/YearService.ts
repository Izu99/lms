import { ApiClient } from '../../shared/utils/api';
import { YearData } from '../types/year.types';

export class TeacherYearService {
  static async getYears(): Promise<YearData[]> {
    const response = await ApiClient.get<{ years: YearData[] }>('/years');
    return response.years || [];
  }

  static async createYear(yearData: { year: string; name: string }): Promise<YearData> {
    return ApiClient.post<YearData>('/years', yearData);
  }

  static async updateYear(id: string, yearData: { year: string; name: string }): Promise<YearData> {
    return ApiClient.put<YearData>(`/years/${id}`, yearData);
  }

  static async deleteYear(id: string): Promise<void> {
    return ApiClient.delete<void>(`/years/${id}`);
  }
}
