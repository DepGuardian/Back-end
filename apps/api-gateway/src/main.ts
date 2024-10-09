import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await new Promise(resolve => setTimeout(resolve, 10000)); 
  await app.listen(3000);
}
bootstrap();
