// apps/auth/src/auth.module.ts
import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '@database/database.module';
import { ResidentController } from './resident.controller';
import { ResidentService } from './resident.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');
        const uri = configService.get<string>('MONGODB_URI');
        const dbName = 'general';

        logger.log(`Connecting to MongoDB: ${uri}`);
        logger.log(`Using database: ${dbName}`);

        return {
          uri,
          dbName,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              logger.log(
                `Successfully connected to database: ${connection.name}`,
              );
              logger.log(`Current database: ${connection.db.databaseName}`);
            });

            connection.on('error', (error) => {
              logger.error('MongoDB connection error:', error);
            });

            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),

    DatabaseModule,
  ],
  controllers: [ResidentController],
  providers: [ResidentService],
})
export class ResidentModule {}
