import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CondominiumService } from './condominium.service';
import { CondominiumController } from './condominium.controller';
import { Condominium, CondominiumSchema } from './condominium.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Condominium.name, schema: CondominiumSchema }]),
  ],
  providers: [CondominiumService],
  controllers: [CondominiumController],
  exports: [CondominiumService],
})
export class CondominiumModule {}