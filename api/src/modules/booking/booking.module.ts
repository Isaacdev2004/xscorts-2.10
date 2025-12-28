import { Module, forwardRef } from '@nestjs/common';
import { AgendaModule, MongoDBModule, QueueModule } from 'src/kernel';
import { PerformerScheduleModule } from 'src/modules/performer-schedule/performer-schedule.module';
import { AuthModule } from '../auth/auth.module';
import { scheduleProviders } from './providers';
import { UserModule } from '../user/user.module';
import { BookingService, UserBookingNotificationService } from './services';
import {
  UserBookingController,
  PerformerBookingController
} from './controllers';
import { MailerModule } from '../mailer/mailer.module';
import { BookingListener, ModelDeleteAccountListener } from './listeners';
import { SocketModule } from '../socket/socket.module';
import { UserBookingNotificationController } from './controllers/user-booking-notification.controller';
import { PerformerModule } from '../performer/performer.module';
import { AdminBookingController } from './controllers/admin-booking.controller';
import { BlockModule } from '../block/block.module';

@Module({
  imports: [
    MongoDBModule,
    QueueModule.forRoot(),
    // inject user module because we request guard from auth, need to check and fix dependencies if not needed later
    UserModule,
    SocketModule,
    AgendaModule.register(),
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerScheduleModule),
    forwardRef(() => UserModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => MailerModule),
    forwardRef(() => BlockModule)
  ],
  providers: [
    ...scheduleProviders,
    BookingService,
    UserBookingNotificationService,
    BookingListener,
    ModelDeleteAccountListener
  ],
  controllers: [
    UserBookingController,
    PerformerBookingController,
    UserBookingNotificationController,
    AdminBookingController
  ],
  exports: [BookingService]
})
export class BookingModule {}
