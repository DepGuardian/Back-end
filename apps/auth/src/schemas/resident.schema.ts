// apps/auth/src/schemas/resident.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResidentDocument = Resident & Document;

@Schema({
  collection: 'residents',
  timestamps: true,
  versionKey: false
})
export class Resident {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  apartment: string;
}

export const ResidentSchema = SchemaFactory.createForClass(Resident);

// Indices
ResidentSchema.index({ email: 1 }, { unique: true });
ResidentSchema.index({ apartment: 1 });