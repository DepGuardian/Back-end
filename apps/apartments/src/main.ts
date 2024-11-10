import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ApartmentModule } from './apartment.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Apartment Microservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ApartmentModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3002, // Asegúrate de que este puerto coincida con el configurado en ApartmentClientModule
      },
    },
  );
  await app.listen();
  logger.log('Apartment Microservice is listening');
}
bootstrap();