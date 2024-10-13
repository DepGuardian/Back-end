import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema()
export class Department {
  @Prop({ required: true })
  idDepa: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  owner: ObjectId;

  @Prop({ required: false })
  family: ObjectId[];

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: false })
  number: number;

  @Prop({ required: true })
  status: 'free' | 'busy' | 'maintenance';
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);