import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApartmentClientService } from './apartment-client.service';
import { ApartmentClientController } from './apartment-client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'APARTMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3016, // Puerto donde correrá tu microservicio de auth
        },
      },
    ]),
  ],
  controllers: [ApartmentClientController],
  providers: [ApartmentClientService],
  exports: [ApartmentClientService],
})
export class ApartmentClientModule {}
