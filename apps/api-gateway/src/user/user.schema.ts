import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  department: string

  @Prop({ required: true })
  tenantId: string;
  


  // Puedes agregar más propiedades según sea necesario
}

export const UserSchema = SchemaFactory.createForClass(User);