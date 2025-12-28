import {
  HttpCode,
  HttpStatus,
  Controller,
  Get,
  Injectable,
  Query
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { CountryService } from '../services/country.service';

@Injectable()
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  list() {
    return DataResponse.ok(this.countryService.getList());
  }

  @Get('/state/list')
  @HttpCode(HttpStatus.OK)
  getStates(@Query('name') name: string) {
    return DataResponse.ok(this.countryService.getStates(name));
  }

  @Get('/city/list')
  @HttpCode(HttpStatus.OK)
  getCities(@Query('name') name: string) {
    return DataResponse.ok(this.countryService.getCities(name));
  }
}
