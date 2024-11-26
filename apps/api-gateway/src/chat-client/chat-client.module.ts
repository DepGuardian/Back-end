import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatClientService } from './chat-client.service';
import { ChatClientController } from './chat-client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3050,
        },
      },
    ]),
  ],
  controllers: [ChatClientController],
  providers: [ChatClientService],
  exports: [ChatClientService],
})
export class ChatClientModule {}