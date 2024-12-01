import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type CommonAreaDocument = CommonArea & Document;

@Schema({
  collection: 'common_areas',
})
export class CommonArea {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: Number, required: true, min: 1 })
  capacity: number;

  @Prop({ type: String, required: true })
  status: string;
}

export const CommonAreaSchema = SchemaFactory.createForClass(CommonArea);
