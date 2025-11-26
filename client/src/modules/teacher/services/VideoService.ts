import { api as ApiClient } from '@/lib/api-client';
import { VideoData } from '@/modules/shared/types/video.types';

export class TeacherVideoService {
  static async getVideos(
    instituteId?: string,
    yearId?: string,
    academicLevelId?: string
  ): Promise<VideoData[]> {
    let url = '/videos';
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
      url = `/videos?${params.toString()}`;
    }

    const response = await ApiClient.get<{ videos: VideoData[] }>(url);
    return response.data.videos || [];
  }
}
