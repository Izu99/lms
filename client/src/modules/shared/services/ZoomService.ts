import { api as ApiClient } from '@/lib/api-client';
import { ZoomLinkData } from '../types/zoom.types';

export class ZoomService {
  static async getZoomLinks(): Promise<ZoomLinkData[]> {
    const response = await ApiClient.get<{ zoomLinks: ZoomLinkData[] }>('/zoom');
    return response.data.zoomLinks || [];
  }

  static async createZoomLink(meeting: MeetingDetails, institute: string, year: string): Promise<ZoomLinkData> {
    const response = await ApiClient.post<{ zoomLink: ZoomLinkData }>('/zoom', { meeting, institute, year });
    return response.data.zoomLink;
  }

  static async deleteZoomLink(id: string): Promise<void> {
    await ApiClient.delete(`/zoom/${id}`);
  }

  static async updateZoomLink(
    id: string,
    data: {
      meeting?: Partial<MeetingDetails>;
      institute?: string;
      year?: string;
    }
  ): Promise<ZoomLinkData> {
    const response = await ApiClient.put<{ zoomLink: ZoomLinkData }>(`/zoom/${id}`, data);
    return response.data.zoomLink;
  }
}
