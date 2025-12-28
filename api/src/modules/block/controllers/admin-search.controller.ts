import {
  Controller, Get, HttpCode, HttpStatus, Injectable, Query, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { Roles } from 'src/modules/auth';
import { DataResponse, PageableData } from 'src/kernel';
import { GetBlockListUserPayload } from '../payloads';
import { PerformerBlockService } from '../services';
import { PerformerBlockUserDto } from '../dtos';

@Injectable()
@Controller('admin/performer-blocks')
export class AdminPerformerBlockController {
  constructor(
    private readonly performerBlockService: PerformerBlockService
  ) {}

  @Get('/users')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('admin')
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }))
  async search(
    @Query() req: GetBlockListUserPayload
  ): Promise<DataResponse<PageableData<PerformerBlockUserDto>>> {
    const results = await this.performerBlockService.adminSearch(req);
    return DataResponse.ok(results);
  }
}
