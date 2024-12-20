import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@libs/schemas/user.schema';
import { DatabaseModule } from '@database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
