import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthClientModule } from './auth-client/auth-client.module';
import { AuthClientController } from './auth-client/auth-client.controller';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { ApartmentClientModule } from './apartment-client/apartment-client.module';
import { ApartmentClientController } from './apartment-client/apartment-client.controller';

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
    ApartmentClientModule,
    DatabaseModule,
  ],
  controllers: [AppController, AuthClientController, ApartmentClientController],
  providers: [AppService],
})
export class AppModule {}
