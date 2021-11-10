import { Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { FireBase } from './senders/firebase.resolver';
import { OneSignal } from './senders/onesignal.resolver';

@Module({
  providers: [PushNotificationService, FireBase, OneSignal],
  exports: [FireBase, OneSignal, PushNotificationService],
})
export class PushNotificationModule {}
