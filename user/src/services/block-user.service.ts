import { APIRequest } from './api-request';

export class BlockUserService extends APIRequest {
  blockUser(data:any) {
    return this.post('/performer-blocks/user', data);
  }

  unblockUser(userId:any) {
    return this.del(`/performer-blocks/user/${userId}`);
  }

  search(query?:any) {
    return this.get(this.buildUrl('/performer-blocks/users', query));
  }
}
export const blockUserService = new BlockUserService();
