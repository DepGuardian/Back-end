import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DepartmentController } from './controllers/department.controller';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DEPARTMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'department-service',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [DepartmentController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}