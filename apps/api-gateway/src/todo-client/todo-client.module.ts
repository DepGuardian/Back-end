import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TodoClientService } from './todo-client.service';
import { TodoClientController } from './todo-client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TODO_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3004,
        },
      },
    ]),
  ],
  controllers: [TodoClientController],
  providers: [TodoClientService],
  exports: [TodoClientService],
})
export class TodoClientModule {}
