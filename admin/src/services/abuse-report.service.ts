import { APIRequest } from './api-request';

class AbuseReportService extends APIRequest {
  detail(id: string) {
    return this.get(`/admin/abuse-report/${id}/view`);
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/abuse-report/performers', query));
  }

  delete(id: string) {
    return this.del(`/admin/abuse-report/${id}`);
  }
}

export const abuseReportService = new AbuseReportService();
