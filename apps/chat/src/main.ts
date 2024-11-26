import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ChatModule } from './chat.module';
import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const logger = new Logger('Chat Microservice');
  
  // Crear una aplicación híbrida que maneje HTTP/WebSocket y TCP
  const app = await NestFactory.create(ChatModule);

  // Configurar CORS
  app.enableCors();

  // Configurar WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  // Configurar el microservicio TCP
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3050,
    },
  });

  // Iniciar ambos servicios
  await app.startAllMicroservices();
  await app.listen(3050); // El WebSocket también escuchará en este puerto

  logger.log('Chat Microservice is running on port 3050');
}

bootstrap();