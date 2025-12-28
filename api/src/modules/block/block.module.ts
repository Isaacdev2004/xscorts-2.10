import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, AgendaModule } from 'src/kernel';
import { AuthModule } from '../auth/auth.module';
import { blockProviders } from './providers';
import { PerformerBlockService } from './services';
import {
  AdminPerformerBlockController,
  PerformerBlockController
} from './controllers';
import { UserModule } from '../user/user.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    MongoDBModule,
    AgendaModule.register(),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => MailerModule)
  ],
  providers: [
    ...blockProviders,
    PerformerBlockService
  ],
  controllers: [
    PerformerBlockController,
    AdminPerformerBlockController
  ],
  exports: [
    ...blockProviders,
    PerformerBlockService
  ]
})

export class BlockModule { }
