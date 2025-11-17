import { api as ApiClient } from '@/lib/api-client';
import { PaperData } from '../types/paper.types';

export class TeacherPaperService {
  static async getPapers(): Promise<PaperData[]> {
    const response = await ApiClient.get<{ papers: PaperData[] }>('/papers');
    return response.data.papers || [];
  }

  static async deletePaper(id: string): Promise<void> {
    await ApiClient.delete<void>(`/papers/${id}`);
  }
}
