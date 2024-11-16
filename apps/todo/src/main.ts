import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TodoModule } from './todo.module';

async function bootstrap() {
  const logger = new Logger('TodoService');
  const configService = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TodoModule,
    {
      transport: Transport.TCP,
      options: {
        host: configService.get('TODO_SERVICE_HOST', 'localhost'),
        port: configService.get('TODO_SERVICE_PORT', 3004),
      },
    },
  );

  await app.listen();
  logger.log(`Todo Microservice is listening on TCP`);
}

bootstrap();
