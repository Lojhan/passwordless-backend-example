import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { MailService } from 'src/mail/mail.service';

@Controller()
export class MessageQueueClientSController {
  constructor(private mailService: MailService) {}

  @MessagePattern('auth', Transport.RMQ)
  getAuthNotifications(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    try {
      this.mailService.sendTokenMail(JSON.parse(data.data));
      channel.ack(context.getMessage());
    } catch (e) {
      channel.nack(context.getMessage());
    }
  }
}
