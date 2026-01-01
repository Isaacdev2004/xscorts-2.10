import { apiRequest } from './api-request';

export class VideoService {
  static async search(params: any = {}) {
    return apiRequest.get('/user/assets/videos/search', params);
  }

  static async findById(id: string) {
    return apiRequest.get(`/user/assets/videos/${id}`);
  }
}

export const videoService = new VideoService();

