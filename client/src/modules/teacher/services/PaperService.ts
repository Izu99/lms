import { api as ApiClient } from '@/lib/api-client';
import { PaperData } from '../types/paper.types';

export class TeacherPaperService {
  static async getPapers(
    instituteId?: string,
    yearId?: string,
    academicLevelId?: string
  ): Promise<PaperData[]> {
    let url = '/papers';
    const params = new URLSearchParams();

    if (instituteId && instituteId !== "all") {
      params.append('institute', instituteId);
    }
    if (yearId && yearId !== "all") {
      params.append('year', yearId);
    }
    if (academicLevelId && academicLevelId !== "all") {
      params.append('academicLevel', academicLevelId);
    }

    if (params.toString()) {
      url = `/papers?${params.toString()}`;
    }

    const response = await ApiClient.get<{ papers: PaperData[] }>(url);
    return response.data.papers || [];
  }

  static async deletePaper(id: string): Promise<void> {
    await ApiClient.delete<void>(`/papers/${id}`);
  }
}
