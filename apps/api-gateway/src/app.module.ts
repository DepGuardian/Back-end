import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthClientModule } from './auth-client/auth-client.module';
import { AuthClientController } from './auth-client/auth-client.controller';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,  // Hace que las variables de entorno estén disponibles en toda la aplicación
      cache: true,
      expandVariables: true, // Permite el uso de variables dentro del .env
    }),
    AuthClientModule,
    HealthModule,
    DatabaseModule,
  ],
  controllers: [AppController, AuthClientController],
  providers: [AppService],
})
export class AppModule {}
