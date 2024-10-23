import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

@Schema()
export class SuperAdmin extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  condominiumId: ObjectId
}

export const SuperAdminSchema = SchemaFactory.createForClass(SuperAdmin);
