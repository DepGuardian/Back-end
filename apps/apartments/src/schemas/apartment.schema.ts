// apps/auth/src/schemas/resident.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document, ObjectId } from 'mongoose';

export type ApartmentDocument = Apartment & Document;

@Schema({
  collection: 'apartments',
  timestamps: true,
  versionKey: false
})
export class Apartment {
  @Prop({ type: Types.ObjectId, required: false, ref: "residents"})
  owner: Types.ObjectId;

  @Prop({ required: true })
  floor: number;

  @Prop({ required: true, unique: true })
  apartment: string;
}

export const ApartmentSchema = SchemaFactory.createForClass(Apartment);
