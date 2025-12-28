import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {
  DataResponse,
  PageableData
} from 'src/kernel';
import { RoleGuard } from 'src/modules/auth/guards';
import { CurrentUser, Roles } from 'src/modules/auth/decorators';
import { UserDto } from 'src/modules/user/dtos';
import {
  PerformerBlockUserDto
} from '../dtos';
import {
  PerformerBlockUserPayload,
  GetBlockListUserPayload
} from '../payloads';
import { PerformerBlockService } from '../services';

@Injectable()
@Controller('performer-blocks')
export class PerformerBlockController {
  constructor(
        private readonly performerBlockService: PerformerBlockService
  ) { }

    @Post('/user')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RoleGuard)
    @Roles('performer')
    @UsePipes(new ValidationPipe({
      transform: true,
      whitelist: true
    }))
  async blockUser(
        @CurrentUser() performer: UserDto,
        @Body() payload: PerformerBlockUserPayload
  ): Promise<DataResponse<any>> {
    const data = await this.performerBlockService.blockUser(performer, payload);
    return DataResponse.ok(data);
  }

    @Delete('/user/:userId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RoleGuard)
    @Roles('performer')
    async unblockUser(
        @Param('userId') userId: string,
        @CurrentUser() performer: UserDto
    ): Promise<DataResponse<any>> {
      const data = await this.performerBlockService.unblockUser(performer, userId);
      return DataResponse.ok(data);
    }

    @Get('/users')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RoleGuard)
    @Roles('performer')
    @UsePipes(new ValidationPipe({
      transform: true,
      whitelist: true
    }))
    async search(
        @CurrentUser() performer: UserDto,
        @Query() req: GetBlockListUserPayload
    ): Promise<DataResponse<PageableData<PerformerBlockUserDto>>> {
      const blocked = await this.performerBlockService.getBlockedUsers(
        performer,
        req
      );
      return DataResponse.ok(blocked);
    }
}
