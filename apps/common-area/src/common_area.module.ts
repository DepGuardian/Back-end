import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@database/database.module';
import { CommonAreaController } from './common_area.controller';
import { CommonAreaService } from './common_area.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),

    DatabaseModule,
  ],
  controllers: [CommonAreaController],
  providers: [CommonAreaService],
})
export class CommonAreaModule {}
