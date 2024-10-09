import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/multitenancy'),
    UsersModule,
  ],
})
export class AppModule {}