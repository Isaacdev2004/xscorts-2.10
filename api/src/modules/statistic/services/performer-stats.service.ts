import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { BookingService } from 'src/modules/booking/services';
import { PerformerService } from 'src/modules/performer/services';
import { EntityNotFoundException } from 'src/kernel';
import { MessageService } from 'src/modules/message/services';
import { VIEW_PERFORMER_MONTHLY_STATS_MODEL_PROVIDER } from '../providers';

import { ViewPerformerMonthlyStatsModel } from '../models/performer-stats.model';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

@Injectable()
export class PerformerStatsService {
  constructor(
    @Inject(VIEW_PERFORMER_MONTHLY_STATS_MODEL_PROVIDER)
    private readonly ViewPerformerMonthlyStats: Model<ViewPerformerMonthlyStatsModel>,
    @Inject(forwardRef(() => BookingService))
    private readonly bookingService: BookingService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService
  ) { }

  public async increaseCurrentMonthView(performerId: string | ObjectId, num = 1) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const monthText = MONTHS[month];
    const record = await this.ViewPerformerMonthlyStats.findOne({
      performerId,
      year
    });
    if (!record) {
      const item = new this.ViewPerformerMonthlyStats({
        performerId,
        year
      });
      item[monthText] = num;
      await item.save();
      return item.toObject();
    }
    await this.ViewPerformerMonthlyStats.updateOne({
      _id: record._id
    }, {
      $inc: {
        [monthText]: num
      }
    });
    record[monthText] = (record[monthText] || 0) + num;
    return record.toObject();
  }

  public async getMonthlyStats(userId: string | ObjectId) {
    const performer = await this.performerService.findByUserId(userId);
    if (!performer) throw new EntityNotFoundException();

    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const text = MONTHS[month];
    const view = await this.ViewPerformerMonthlyStats.findOne({ performerId: performer._id, year });
    const monthView = view ? view[text] : 0;
    // get booking number, chat number
    const monthBooking = await this.bookingService.getTotalMonthBookingByTargetId(userId);
    const monthText = await this.messageService.totalMessageByRecipientId(userId);
    return {
      monthText,
      monthView,
      monthBooking
    };
  }
}
