import {
  Controller,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  UseGuards,
  Param,
  Post
} from '@nestjs/common';
import { DataResponse, PageableData } from 'src/kernel';
import { Roles } from 'src/modules/auth';
import { RoleGuard } from 'src/modules/auth/guards';
import { BookingDto } from '../dtos';
import { BookingSearchRequest } from '../payloads';
import { BookingService } from '../services';

@Controller('admin/booking')
export class AdminBookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/search')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getBookings(
    @Query() query: BookingSearchRequest
  ): Promise<DataResponse<PageableData<BookingDto>>> {
    const data = await this.bookingService.getByDateRanges({ ...query });
    return DataResponse.ok(data);
  }

  @Get('/:id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async detail(@Param('id') id: string): Promise<DataResponse<BookingDto>> {
    const data = await this.bookingService.view(id);
    return DataResponse.ok(data);
  }

  @Post('/:id/approve')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async accept(@Param('id') id: string) {
    await this.bookingService.updateStatusByAdmin(id, 'accepted');
    return DataResponse.ok({ success: true });
  }

  @Post('/:id/reject')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async reject(@Param('id') id: string) {
    await this.bookingService.updateStatusByAdmin(id, 'rejected');
    return DataResponse.ok({ success: true });
  }

  @Post('/:id/dismiss')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async dismiss(@Param('id') id: string) {
    await this.bookingService.updateStatusByAdmin(id, 'pending');
    return DataResponse.ok({ success: true });
  }
}
