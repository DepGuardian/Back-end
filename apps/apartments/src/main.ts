import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ApartmentModule } from './apartment.module';

async function bootstrap() {
  const logger = new Logger('Apartment Microservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ApartmentModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3016, // Asegúrate de que este puerto coincida con el configurado en ApartmentClientModule
      },
    },
  );
  await app.listen();
  logger.log('Apartment Microservice is listening');
}
bootstrap();
