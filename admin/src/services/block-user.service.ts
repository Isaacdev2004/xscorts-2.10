import { APIRequest } from './api-request';

export class BlockUserService extends APIRequest {
  search(query? : any) : any {
   return this.get(this.buildUrl('/admin/performer-blocks/users', query));
  }
}
export const blockUserService = new BlockUserService();
