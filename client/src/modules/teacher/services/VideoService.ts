import { ApiClient } from '../../shared/utils/api';
import { VideoData } from '../types/video.types';

export class TeacherVideoService {
  static async getVideos(): Promise<VideoData[]> {
    const response = await ApiClient.get<{ videos: VideoData[] }>('/videos');
    return response.videos || [];
  }
}
