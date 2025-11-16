import { ApiClient } from '../../shared/utils/api';
import { ZoomLinkData } from '../types/zoom.types';

export class TeacherZoomService {
  static async getZoomLinks(): Promise<ZoomLinkData[]> {
    const response = await ApiClient.get<{ zoomLinks: ZoomLinkData[] }>('/zoom');
    return response.zoomLinks || [];
  }

  static async createZoomLink(title: string, description: string, link: string, institute: string, year: string): Promise<ZoomLinkData> {
    return ApiClient.post<ZoomLinkData>('/zoom', { title, description, link, institute, year });
  }

  static async deleteZoomLink(id: string): Promise<void> {
    return ApiClient.delete<void>(`/zoom/${id}`);
  }
}
