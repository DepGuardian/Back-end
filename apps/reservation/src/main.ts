import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ReservationModule } from './reservation.module';

async function bootstrap() {
  const logger = new Logger('Reservation Microservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ReservationModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3009, // Asegúrate de que este puerto coincida con el configurado en ApartmentClientModule
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen();
  logger.log('Reservation Microservice is listening');
}
bootstrap();
