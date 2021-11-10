import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { MailService } from 'src/mail/mail.service';
import { PushNotificationService } from 'src/push-notification/push-notification.service';

@Controller()
export class MessageQueueClientSController {
  constructor(
    private mailService: MailService,
    private pushNotificationService: PushNotificationService,
  ) {}

  @MessagePattern('mail-auth', Transport.RMQ)
  async getMailAuthNotifications(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    try {
      await this.mailService.sendTokenMail(JSON.parse(data.data));
      channel.ack(context.getMessage());
    } catch (e) {
      channel.nack(context.getMessage());
    }
  }

  @MessagePattern('push-auth', Transport.RMQ)
  async getPushAuthNotifications(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    const channel = context.getChannelRef();
    try {
      await this.pushNotificationService.sendTokenNotification(
        JSON.parse(data.data),
      );
      channel.ack(context.getMessage());
    } catch (e) {
      channel.nack(context.getMessage());
      return e;
    }
  }
}
