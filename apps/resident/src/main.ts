import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ResidentModule } from './resident.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Reisident Microservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ResidentModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3003, // Asegúrate de que este puerto coincida con el configurado en AuthClientModule
      },
    },
  );
  await app.listen();
  logger.log('Resident Microservice is listening');
}
bootstrap();