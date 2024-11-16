import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ResidentClientService } from './resident-client.service';
import { ResidentClientController } from './resident-client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RESIDENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3003, // Puerto donde correrá tu microservicio de resident
        },
      },
    ]),
  ],
  controllers: [ResidentClientController],
  providers: [ResidentClientService],
  exports: [ResidentClientService],
})
export class ResidentClientModule {}
