import { api as ApiClient } from '@/lib/api-client';
import { ZoomLinkData, MeetingDetails } from '../types/zoom.types';

export class ZoomService {
  static async getZoomLinks(
    instituteId?: string,
    yearId?: string,
    academicLevelId?: string
  ): Promise<ZoomLinkData[]> {
    let url = '/zoom';
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
      url = `/zoom?${params.toString()}`;
    }

    const response = await ApiClient.get<{ zoomLinks: ZoomLinkData[] }>(url);
    return response.data.zoomLinks || [];
  }

  static async createZoomLink(meeting: MeetingDetails, institute: string, year: string, academicLevel: string, availability: 'all' | 'physical' | 'paid'): Promise<ZoomLinkData> {
    const response = await ApiClient.post<{ zoomLink: ZoomLinkData }>('/zoom', { meeting, institute, year, academicLevel, availability });
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
      academicLevel?: string;
      availability?: 'all' | 'physical' | 'paid';
    }
  ): Promise<ZoomLinkData> {
    const response = await ApiClient.put<{ zoomLink: ZoomLinkData }>(`/zoom/${id}`, data);
    return response.data.zoomLink;
  }
}
