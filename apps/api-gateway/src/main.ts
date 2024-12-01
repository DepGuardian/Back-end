import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Manage Condominium API')
    .setDescription('API para la gestión de condominios')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configuración de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors();

  app.useWebSocketAdapter(new IoAdapter(app));

  Logger.log(
    `Server is running on http://localhost:${process.env.PORT ?? 3000}`,
    'Port',
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
