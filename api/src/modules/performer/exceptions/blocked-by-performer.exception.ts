import { HttpException } from '@nestjs/common';

export class BlockedByPerformerException extends HttpException {
  constructor() {
    super('This model has blocked you!', 403);
  }
}
