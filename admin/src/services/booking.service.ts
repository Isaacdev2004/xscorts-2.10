import { APIRequest } from './api-request';

export class BookingService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/booking/search', query));
  }

  findById(id: string) {
    return this.get(`/admin/booking/${id}`);
  }
}

export const bookingService = new BookingService();
