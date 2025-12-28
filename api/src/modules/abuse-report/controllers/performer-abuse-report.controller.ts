import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { CurrentUser } from 'src/modules/auth/decorators';
import { AuthGuard } from 'src/modules/auth/guards';
import { UserDto } from 'src/modules/user/dtos';
import { AbuseReportResponse } from '../dtos';
import { PerformerAbuseReportPayload } from '../payloads';
import { PerformerAbuseReportService } from '../services';

@Controller('abuse-report/performers')
export class PerformerAbuseReportController {
  constructor(private readonly reportService: PerformerAbuseReportService) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() payload: PerformerAbuseReportPayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<AbuseReportResponse>> {
    const result = await this.reportService.create(payload, user);
    return DataResponse.ok(result);
  }
}
