import {
  HttpCode,
  HttpStatus,
  Controller,
  Get,
  Injectable,
  UseGuards,
  Post,
  Body
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { RoleGuard } from 'src/modules/auth/guards';
import { CurrentUser, Roles } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import { isObjectId } from 'src/kernel/helpers/string.helper';
import { PerformerStatsService } from '../services/performer-stats.service';

@Injectable()
@Controller('performer/statistics')
export class PerformerStatisticController {
  constructor(private readonly performerStatsService: PerformerStatsService) { }

  @Get('/current-month')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  async getCurrentMonthStats(
    @CurrentUser() user: UserDto
  ) {
    const stats = await this.performerStatsService.getMonthlyStats(user._id);
    return DataResponse.ok(stats);
  }

  @Post('/view')
  @HttpCode(HttpStatus.OK)
  async increaseView(
    @Body() payload: Record<string, any>
  ) {
    if (!payload.performerId || !isObjectId(payload.performerId)) return DataResponse.ok(true);
    await this.performerStatsService.increaseCurrentMonthView(payload.performerId);
    return DataResponse.ok(true);
  }
}
