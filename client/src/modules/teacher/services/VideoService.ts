import { api as ApiClient } from '@/lib/api-client';
import { VideoData } from '@/modules/shared/types/video.types';

export class TeacherVideoService {
  static async getVideos(): Promise<VideoData[]> {
    const response = await ApiClient.get<{ videos: VideoData[] }>('/videos');
    return response.data.videos || [];
  }
}
