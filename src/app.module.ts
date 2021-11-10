import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './database/config/typeorm.config';
import { MessageQueueClientModule } from './message-queue-client/message-queue-client.module';
import { MailModule } from './mail/mail.module';
import { PushNotificationModule } from './push-notification/push-notification.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MessageQueueClientModule,
    MailModule,
    PushNotificationModule,
  ],
})
export class AppModule {}
