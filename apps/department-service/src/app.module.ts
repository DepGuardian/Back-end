import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentModule } from './department.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/multitenancy'),
    DepartmentModule,
  ],
})
export class AppModule {}