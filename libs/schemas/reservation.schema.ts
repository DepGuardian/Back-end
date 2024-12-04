import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

export type ReservationDocument = Reservation & Document;

@Schema({
  collection: 'reservations',
  timestamps: true,
  versionKey: false,
})
export class Reservation {//modifiqué esto para que se genere un id automáticamente, no me maten :C
 
  @Prop({ type: Types.ObjectId, required: true, ref: 'common_area' })
  id_common_area: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'resident' })
  id_host: Types.ObjectId;

  @Prop({
    type: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    required: true,
  })
  time_interval: { start: Date; end: Date };
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
