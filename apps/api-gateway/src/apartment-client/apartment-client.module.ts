import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApartmentClientService } from './apartment-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'APARTMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002, // Puerto donde correrá tu microservicio de auth
        },
      },
    ]),
  ],
  providers: [ApartmentClientService],
  exports: [ApartmentClientService],
})
export class ApartmentClientModule {}