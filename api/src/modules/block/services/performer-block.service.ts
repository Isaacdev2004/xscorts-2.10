import {
  Injectable,
  Inject,
  forwardRef
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  EntityNotFoundException
} from 'src/kernel';
import { ObjectId } from 'mongodb';
import { UserService } from 'src/modules/user/services';
import { uniq } from 'lodash';
import { MailerService } from 'src/modules/mailer';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import {
  PerformerBlockUserModel
} from '../models';
import {
  PERFORMER_BLOCK_USER_PROVIDER
} from '../providers';
import { GetBlockListUserPayload, PerformerBlockUserPayload } from '../payloads';
import { PerformerBlockUserDto } from '../dtos';

@Injectable()
export class PerformerBlockService {
  constructor(
      @Inject(forwardRef(() => UserService))
      private readonly userService: UserService,
      @Inject(PERFORMER_BLOCK_USER_PROVIDER)
      private readonly blockedByPerformerModel: Model<PerformerBlockUserModel>,
      private readonly mailService: MailerService
  ) { }

  public findOne(query) {
    return this.blockedByPerformerModel.findOne(query);
  }

  public async checkBlockedByPerformer(
    performerId: string | ObjectId,
    userId: string | ObjectId
  ): Promise<boolean> {
    const blocked = await this.blockedByPerformerModel.countDocuments({
      sourceId: performerId,
      targetId: userId
    });

    return blocked > 0;
  }

  public async checkBlockList(performerId: string | ObjectId, checkProfileIds: ObjectId[]): Promise<Record<string, boolean>> {
    if (!checkProfileIds.length) return {};
    const items = await this.blockedByPerformerModel.find({
      sourceId: performerId,
      targetId: {
        $in: checkProfileIds
      }
    });

    return checkProfileIds.reduce((results, checkProfileId) => {
      const found = items.find((item) => item.targetId.toString() === checkProfileId.toString());
      // eslint-disable-next-line no-param-reassign
      results[checkProfileId.toString()] = !!found;

      return results;
    }, {} as Record<string, boolean>);
  }

  public async checkBlockByList(userId: string | ObjectId, checkProfileIds: ObjectId[]): Promise<Record<string, boolean>> {
    if (!checkProfileIds.length) return {};
    const items = await this.blockedByPerformerModel.find({
      sourceId: {
        $in: checkProfileIds
      },
      targetId: userId
    });

    return checkProfileIds.reduce((results, checkProfileId) => {
      const found = items.find((item) => item.sourceId.toString() === checkProfileId.toString());
      // eslint-disable-next-line no-param-reassign
      results[checkProfileId.toString()] = !!found;

      return results;
    }, {} as Record<string, boolean>);
  }

  public async blockUser(
    user: UserDto,
    payload: PerformerBlockUserPayload
  ) {
    const blocked = await this.blockedByPerformerModel.findOne({
      sourceId: user._id,
      targetId: payload.targetId
    });
    if (blocked) {
      return blocked;
    }
    const newBlock = await this.blockedByPerformerModel.create({
      ...payload,
      source: 'performer',
      sourceId: user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const target = await this.userService.findById(payload.targetId);
    // mailer
    target?.email && await this.mailService.send({
      subject: 'Model block',
      to: target.email,
      data: {
        userName: target.name || target.username || `${target.firstName} ${target.lastName}` || 'there',
        message: `${user.name || user.username || 'Model'} has blocked you`
      },
      template: 'block-user-notification'
    });
    return newBlock;
  }

  public async unblockUser(user: UserDto, targetId: string) {
    const blocked = await this.blockedByPerformerModel.findOne({
      sourceId: user._id,
      targetId
    });
    if (!blocked) {
      throw new EntityNotFoundException();
    }
    await blocked.remove();
    const target = await this.userService.findById(targetId);
    // mailer
    target?.email && await this.mailService.send({
      subject: 'Model unblock',
      to: target.email,
      data: {
        userName: target.name || target.username || `${target.firstName} ${target.lastName}` || 'there',
        message: `${user.name || user.username || 'Model'} has unblocked you`
      },
      template: 'block-user-notification'
    });
    return { unlocked: true };
  }

  public async getBlockedUsers(
    user: UserDto,
    req: GetBlockListUserPayload
  ) {
    const query = {
      sourceId: user._id
    } as any;

    // If there is a search query (req.q), prepare a regexp for searching usernames
    let usernameRegexp: RegExp | null = null;
    if (req.q) {
      usernameRegexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, ''),
        'i'
      );
    }

    let sort = {
      createdAt: -1
    } as any;

    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy || 'updatedAt']: req.sort || -1
      };
    }

    const data = await this.blockedByPerformerModel
      .find(query)
      .sort(sort)
      .limit(req.limit ? Number(req.limit) : 10)
      .skip(Number(req.offset));
    const list = data.map((d) => new PerformerBlockUserDto(d));
    const targetIds = uniq(data.map((d) => d.targetId));
    const users = await this.userService.findByIds(targetIds);

    // Filter users by username if there is a search query
    const filteredUsers = usernameRegexp
      ? users.filter((u) => usernameRegexp.test(u.username))
      : users;
    const filteredUserIds = new Set(filteredUsers.map((u) => u._id.toString()));
    const filteredList = list.filter((u) => filteredUserIds.has(u.targetId.toString()));

    filteredList.forEach((u) => {
      const info = users.find((s) => `${s._id}` === `${u.targetId}`);
      // eslint-disable-next-line no-param-reassign
      u.targetInfo = info ? new UserDto(info).toResponse() : null;
    });

    return {
      data: filteredList,
      total: filteredList.length
    };
  }

  public async adminSearch(req: GetBlockListUserPayload) {
    const query: Record<string, any> = {};

    let sort = {};
    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy]: req.sort
      };
    }

    const [data, total] = await Promise.all([
      this.blockedByPerformerModel
        .find(query)
        .sort(sort)
        .limit(req.limit ? Number(req.limit) : 10)
        .skip(Number(req.offset)),
      this.blockedByPerformerModel.countDocuments(query)
    ]);

    const list = data.map((d) => new PerformerBlockUserDto(d));
    const targetIds = uniq(data.map((d) => d.targetId));
    const sourceIds = uniq(data.map((d) => d.sourceId));

    const [users, performers] = await Promise.all([
      this.userService.findByIds(targetIds),
      this.userService.findByIds(sourceIds)
    ]);

    list.forEach((u) => {
      const targetInfo = users.find((s) => `${s._id}` === `${u.targetId}`);
      const sourceInfo = performers.find((s) => `${s._id}` === `${u.sourceId}`);
      // eslint-disable-next-line no-param-reassign
      u.targetInfo = targetInfo ? new UserDto(targetInfo).toResponse() : null;
      // eslint-disable-next-line no-param-reassign
      u.sourceInfo = sourceInfo ? new PerformerDto(sourceInfo).toResponse() : null;
    });

    return {
      data: list,
      total
    };
  }
}
