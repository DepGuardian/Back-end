import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommonAreaClientService } from './common-area-client.service';
import { CommonAreaClientController } from './common-area-client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COMMON_AREA_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3008, // Puerto donde correrá tu microservicio de auth
        },
      },
    ]),
  ],
  controllers: [CommonAreaClientController],
  providers: [CommonAreaClientService],
  exports: [CommonAreaClientService],
})
export class CommonAreaClientModule {}
