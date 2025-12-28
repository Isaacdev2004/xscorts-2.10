import { APIRequest } from './api-request';

export class SeoService extends APIRequest {
  findByPath(payload: any) {
    return this.post('/seo/get', payload);
  }
}

export const seoService = new SeoService();
