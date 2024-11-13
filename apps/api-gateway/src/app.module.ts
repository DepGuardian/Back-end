import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthClientModule } from './auth-client/auth-client.module';
import { AuthClientController } from './auth-client/auth-client.controller';
import { ResidentClientModule } from './resident-client/resident-client.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from '../../../libs/database/database.module';
import { ResidentClientController } from './resident-client/resident-client.controller';
import { ApartmentClientModule } from './apartment-client/apartment-client.module';
import { ApartmentClientController } from './apartment-client/apartment-client.controller';
import { TodoClientModule } from './todo-client/todo-client.module';
import { TodoClientController } from './todo-client/todo-client.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la aplicación
      cache: true,
      expandVariables: true, // Permite el uso de variables dentro del .env
    }),
    AuthClientModule,
    ResidentClientModule,
    HealthModule,
    ApartmentClientModule,
    TodoClientModule,
    DatabaseModule,
  ],
  controllers: [
    AppController,
    AuthClientController,
    ApartmentClientController,
    ResidentClientController,
    TodoClientController,
  ],
  providers: [AppService],
})
export class AppModule {}
