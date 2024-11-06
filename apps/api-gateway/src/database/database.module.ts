import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DatabaseConnectionService } from './database.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: 'general',
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: 'general',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseConnectionService],
  exports: [MongooseModule, DatabaseConnectionService],
})
export class DatabaseModule {}