import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

export type CommonAreaDocument = CommonArea & Document;

@Schema({
    collection: 'common_areas',
  })
  export class CommonArea {
    @Prop({ type: String, required: true })
    name: string;
  
    @Prop({ type: String, required: false })
    description: string;

    @Prop({type: Types.ObjectId})
    id: Types.ObjectId
  }
  
  export const CommonAreaSchema = SchemaFactory.createForClass(CommonArea);
  