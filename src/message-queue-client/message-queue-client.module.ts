import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { MessageQueueClientSController } from './message-queue-client.controller';
import { MessageQueueClientService } from './message-queue-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5673'],
          noAck: false,
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MailModule,
  ],
  providers: [MessageQueueClientService, MailService],
  controllers: [MessageQueueClientSController],
  exports: [MessageQueueClientService],
})
export class MessageQueueClientModule {}
