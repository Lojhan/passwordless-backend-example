import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const mqService = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: ['amqp://localhost:5672'],
  //       queue: 'cats_queue',
  //       queueOptions: {
  //         durable: false,
  //       },
  //     },
  //   },
  // );

  app.connectMicroservice<any>({
    name: 'AUTH_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5673'],
      queue: 'auth_queue',
      noAck: false,
      queueOptions: {
        durable: false,
      },
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Auth')
    .setDescription('Auth Api Boilerplate')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
