import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@libs/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AuthClientModule } from './auth-client/auth-client.module';
import { ResidentClientModule } from './resident-client/resident-client.module';
import { ApartmentClientModule } from './apartment-client/apartment-client.module';
import { TodoClientModule } from './todo-client/todo-client.module';
import { ReservationClientModule } from './reservation-client/reservation-client.module';
import { CommonAreaClientModule } from './common-area-client/common-area-client.module';
import { ChatClientModule } from './chat-client/chat-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // Hace que las variables de entorno estén disponibles en toda la aplicación
      cache: true,
      expandVariables: true, // Permite el uso de variables dentro del .env
    }),
    HealthModule,
    AuthClientModule,
    ResidentClientModule,
    ApartmentClientModule,
    TodoClientModule,
    ReservationClientModule,
    CommonAreaClientModule,
    ChatClientModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
