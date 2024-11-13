import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TodoClientService } from './todo-client.service';

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
  providers: [TodoClientService],
  exports: [TodoClientService],
})
export class TodoClientModule {}
