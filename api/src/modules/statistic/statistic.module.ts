import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { MongoDBModule } from 'src/kernel';
import {
  StatisticService
} from './services';
import {
  StatisticController
} from './controllers';
import { AuthModule } from '../auth/auth.module';
import { AssetsModule } from '../assets/assets.module';
import { PerformerModule } from '../performer/performer.module';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { PaymentModule } from '../payment/payment.module';
import { BookingModule } from '../booking/booking.module';
import { performerStatsProviders } from './providers';
import { MessageModule } from '../message/message.module';
import { PerformerStatisticController } from './controllers/performer-stats.controller';
import { PerformerStatsService } from './services/performer-stats.service';

@Module({
  imports: [
    MongoDBModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => AssetsModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => BookingModule),
    forwardRef(() => MessageModule)
  ],
  providers: [
    ...performerStatsProviders,
    StatisticService,
    PerformerStatsService
  ],
  controllers: [
    StatisticController,
    PerformerStatisticController
  ],
  exports: [
    StatisticService,
    PerformerStatsService
  ]
})
export class StatisticModule {}
