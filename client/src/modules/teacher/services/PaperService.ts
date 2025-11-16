import { ApiClient } from '../../shared/utils/api';
import { PaperData } from '../types/paper.types';

export class TeacherPaperService {
  static async getPapers(): Promise<PaperData[]> {
    const response = await ApiClient.get<{ papers: PaperData[] }>('/papers');
    return response.papers || [];
  }

  static async deletePaper(id: string): Promise<void> {
    return ApiClient.delete<void>(`/papers/${id}`);
  }
}
