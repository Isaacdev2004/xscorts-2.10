import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Put,
  Param,
  Delete,
  Get,
  Query
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, PageableData, SearchRequest } from 'src/kernel';
import { Roles } from 'src/modules/auth';
import {
  SeoCreatePayload,
  SeoUpdatePayload
} from '../payloads';
import { SeoDto } from '../dtos';
import { SeoService } from '../services/seo.service';

@Injectable()
@Controller('admin/seo')
export class AdminSeoController {
  constructor(
    private readonly seoService: SeoService
  ) { }

  @Post('/')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() payload: SeoCreatePayload
  ): Promise<DataResponse<SeoDto>> {
    const seo = await this.seoService.create(payload);
    return DataResponse.ok(seo);
  }

  @Put('/:id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() payload: SeoUpdatePayload
  ): Promise<DataResponse<SeoDto>> {
    const seo = await this.seoService.update(id, payload);
    return DataResponse.ok(seo);
  }

  @Delete('/:id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async delete(@Param('id') id: string): Promise<DataResponse<boolean>> {
    const deleted = await this.seoService.delete(id);
    return DataResponse.ok(deleted);
  }

  @Get('/search')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(
    @Query() req: SearchRequest
  ): Promise<DataResponse<PageableData<SeoDto>>> {
    const resp = await this.seoService.search(req);
    return DataResponse.ok(resp);
  }

  @Get('/:id/view')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async details(@Param('id') id: string): Promise<DataResponse<SeoDto>> {
    const seo = await this.seoService.findById(id);
    return DataResponse.ok(seo);
  }
}
