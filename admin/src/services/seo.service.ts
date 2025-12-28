import { ISEO } from 'src/interfaces/seo';
import { APIRequest } from './api-request';

export class SeoService extends APIRequest {
  create(payload: ISEO) {
    return this.post('/admin/seo', payload);
  }

  search(query: any) {
    return this.get(this.buildUrl('/admin/seo/search', query as any));
  }

  findById(id: string) {
    return this.get(`/admin/seo/${id}/view`);
  }

  update(id: string, payload: ISEO) {
    return this.put(`/admin/seo/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/admin/seo/${id}`);
  }
}

export const seoService = new SeoService();
