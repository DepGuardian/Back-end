import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Auth Microservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001, // Asegúrate de que este puerto coincida con el configurado en AuthClientModule
      },
    },
  );
  await app.listen();
  logger.log('Auth Microservice is listening');
}
bootstrap();