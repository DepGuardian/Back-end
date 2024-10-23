import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema({ collection: 'condominiums' })
export class Condominium extends Document {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  state: string;
  @Prop({ required: true })
  postalCode: string;
  @Prop({ required: true })
  country: string;
  @Prop({ required: true })
  totalUnits: number;
  @Prop({ required: true })
  totalFloors: number;
  @Prop({ required: true })
  totalParking: number;
  @Prop({ required: true })
  totalResidents: number;
  @Prop({ required: true })
  totalEmployees: number;
  @Prop({ required: true })
  tenantId: string;
  @Prop({ required: true })
  superAdminId: ObjectId;
}

export const CondominiumSchema = SchemaFactory.createForClass(Condominium);
