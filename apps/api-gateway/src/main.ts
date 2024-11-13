import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  Logger.log(
    `Server is running on http://localhost:${process.env.PORT ?? 3000}`,
    'Port',
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
