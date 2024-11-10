import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthClientModule } from './auth-client/auth-client.module';
import { AuthClientController } from './auth-client/auth-client.controller';
import { ResidentClientModule } from './resident-client/resident-client.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { ResidentClientController } from './resident-client/resident-client.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,  // Hace que las variables de entorno estén disponibles en toda la aplicación
      cache: true,
      expandVariables: true, // Permite el uso de variables dentro del .env
    }),
    AuthClientModule,
    ResidentClientModule,
    HealthModule,
    DatabaseModule,
  ],
  controllers: [AppController, AuthClientController, ResidentClientController],
  providers: [AppService],
})
export class AppModule {}
