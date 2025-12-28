import {
  Inject, Injectable, Logger, OnModuleInit
} from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { PERFORMER_CHANNEL } from 'src/modules/performer/constants';
import { Model } from 'mongoose';
import { UserService } from 'src/modules/user/services';
import { MailerService } from 'src/modules/mailer';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { BookingModel } from '../models';
import { BOOKING_SCHEDULE_PROVIDER } from '../providers';
import { UserBookingNotificationService } from '../services';
import { BOOKING_STATUS } from '../constants';

const BOOKING_CANCEL = 'BOOKING_CANCEL';

@Injectable()
export class ModelDeleteAccountListener implements OnModuleInit {
  private logger = new Logger(ModelDeleteAccountListener.name);

  constructor(
    @Inject(BOOKING_SCHEDULE_PROVIDER)
    private readonly Booking: Model<BookingModel>,
    private readonly queueEventService: QueueEventService,
    private readonly userService: UserService,
    private readonly mailService: MailerService,
    private readonly notificationService: UserBookingNotificationService,
    private readonly socketUserService: SocketUserService
  ) { }

  onModuleInit() {
    this.queueEventService.subscribe(
      PERFORMER_CHANNEL,
      BOOKING_CANCEL,
      this.subscribe.bind(this)
    );
  }

  async subscribe(event: QueueEvent) {
    try {
      const { eventName, data } = event;
      if (eventName !== EVENT.DELETED) return;
      // check valid booking and cancel
      const bookings = await this.Booking.find({
        targetId: {
          $in: [
            data._id,
            data.userId
          ]
        },
        status: {
          $in: ['accepted', 'paid']
        },
        startAt: {
          $gt: new Date()
        }
      });
      await bookings.reduce(async (cb, booking) => {
        await cb;
        // cancel this booking
        await this.Booking.updateOne({ _id: booking._id }, {
          $set: {
            status: BOOKING_STATUS.CANCELLED
          }
        });
        const { targetId, fromSourceId, _id } = booking;
        await this.notificationService.create(fromSourceId, _id, targetId);
        await this.socketUserService.emitToUsers(
          fromSourceId,
          'notify_booking_status_changed',
          {}
        );

        const user = await this.userService.findById(booking.fromSourceId);
        if (user?.email) {
          await this.mailService.send({
            subject: `Cancellation—${data.username}`,
            to: user.email,
            data: {
              performer: data,
              booking: booking.toObject()
            },
            template: 'cancel-booking-request-to-delete-account'
          });
        }

        return Promise.resolve();
      }, Promise.resolve());
    } catch (e) {
      this.logger.error(e);
    }
  }
}
