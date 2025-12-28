import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Param,
  Query
} from '@nestjs/common';
import { DataResponse, PageableData } from 'src/kernel';
import { Roles } from 'src/modules/auth/decorators';
import { RoleGuard } from 'src/modules/auth/guards';
import { AbuseReportResponse } from '../dtos';
import { PerformerAbuseReportSearchPayload } from '../payloads';
import { PerformerAbuseReportService } from '../services';

@Controller('admin/abuse-report')
export class AdminAbuseReportController {
  constructor(private readonly reportService: PerformerAbuseReportService) { }

  @Get('/performers')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async adminSearch(
    @Query() query: PerformerAbuseReportSearchPayload
  ): Promise<DataResponse<PageableData<AbuseReportResponse>>> {
    const results = await this.reportService.search(query);
    return DataResponse.ok(results);
  }

  @Get('/:id/view')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async adminGetAbuseReportDetail(
    @Param('id') id: string
  ): Promise<DataResponse<AbuseReportResponse>> {
    const result = await this.reportService.getAbuseReportById(id);
    return DataResponse.ok(result);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  async delete(@Param('id') id: string): Promise<DataResponse<any>> {
    await this.reportService.delete(id);
    return DataResponse.ok({ success: true });
  }
}
