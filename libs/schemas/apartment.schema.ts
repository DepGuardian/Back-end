// apps/auth/src/schemas/resident.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ApartmentDocument = Apartment & Document;

@Schema({
  collection: 'apartments',
  timestamps: true,
  versionKey: false,
})
export class Apartment {
  @Prop({ type: Types.ObjectId, required: false, ref: 'apartments' })
  owner: Types.ObjectId;

  @Prop({ required: true })
  floor: number;

  @Prop({ required: true, unique: true })
  apartment: string;

  @Prop({ required: true })
  code: number;
}

export const ApartmentSchema = SchemaFactory.createForClass(Apartment);
