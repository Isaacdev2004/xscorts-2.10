import {
  Controller,
  Injectable,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { SeoDto } from '../dtos';
import { SeoService } from '../services/seo.service';

@Injectable()
@Controller('/seo')
export class SeoController {
  constructor(
    private readonly seoService: SeoService
  ) { }

  @Post('/get')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async details(
    @Body('path') path: string
  ): Promise<DataResponse<Partial<SeoDto>>> {
    const seo = await this.seoService.findByPath(path);
    return DataResponse.ok(seo);
  }
}
