import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReservationClientService } from './reservation-client.service';
import { ReservationClientController } from './reservation-client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RESERVATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3009, // Puerto donde correrá tu microservicio de auth
        },
      },
    ]),
  ],
  controllers: [ReservationClientController],
  providers: [ReservationClientService],
  exports: [ReservationClientService],
})
export class ReservationClientModule {}
