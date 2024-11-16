import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthClientService } from './auth-client.service';
import { AuthClientController } from './auth-client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001, // Puerto donde correrá tu microservicio de auth
        },
      },
    ]),
  ],
  controllers: [AuthClientController],
  providers: [AuthClientService],
  exports: [AuthClientService],
})
export class AuthClientModule {}
