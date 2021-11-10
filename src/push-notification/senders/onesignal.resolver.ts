import { Injectable } from '@nestjs/common';
import { pushNotificationResolver } from './push-notification-resolver.interface';

@Injectable()
export class OneSignal implements pushNotificationResolver {
  configure(): void {
    console.log('aaaaaa');
  }

  async sendNotification(
    appId: string,
    userId: string | string[],
    notification: any,
  ): Promise<any> {
    try {
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
