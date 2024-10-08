import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'user-service',
          port: 3001,
        },
      },
      // Registra otros servicios aquí...
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}