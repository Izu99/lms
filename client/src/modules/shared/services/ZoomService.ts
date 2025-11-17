import { api as ApiClient } from '@/lib/api-client';
import { ZoomLinkData } from '../types/zoom.types';

export class ZoomService {
  static async getZoomLinks(): Promise<ZoomLinkData[]> {
    const response = await ApiClient.get<{ zoomLinks: ZoomLinkData[] }>('/zoom');
    return response.data.zoomLinks || [];
  }

  static async createZoomLink(title: string, description: string, link: string, institute: string, year: string): Promise<ZoomLinkData> {
    const response = await ApiClient.post<{ zoomLink: ZoomLinkData }>('/zoom', { title, description, link, institute, year });
    return response.data.zoomLink;
  }

  static async deleteZoomLink(id: string): Promise<void> {
    await ApiClient.delete(`/zoom/${id}`);
  }
}
