import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { FireBase } from './senders/firebase.resolver';
import { OneSignal } from './senders/onesignal.resolver';

@Injectable()
export class PushNotificationService {
  constructor(
    private firebasePushService: FireBase,
    private oneSignalPushService: OneSignal,
  ) {
    firebasePushService.configure();
  }

  async sendTokenNotification(user: User) {
    if (user.firebaseToken)
      return this.firebasePushService.sendNotification(
        'auth-test-1fb1e',
        user.firebaseToken,
        { title: 'Token de Login da sua conta' },
      );
    else if (user.oneSignalToken)
      return this.firebasePushService.sendNotification(
        '767a9784-40fc-4a49-bf25-2ed6e040a125',
        user.firebaseToken,
        'Token de Login da sua conta',
      );
    else
      throw new BadRequestException(
        'O usuário não possui token de notificação push',
      );
  }
}
