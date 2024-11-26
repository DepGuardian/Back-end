import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { CommonAreaModule } from './common_area.module';

async function bootstrap() {
  const logger = new Logger('CommonArea Microservice');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CommonAreaModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3008, // Asegúrate de que este puerto coincida con el configurado en CommonAreaClientModule
      },
    },
  );
  await app.listen();
  logger.log('CommonArea Microservice is listening');
}
bootstrap();
