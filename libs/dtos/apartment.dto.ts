import { Types } from 'mongoose';
import { IsString } from 'class-validator'

export interface CreateApartmentDto {
  owner: Types.ObjectId;
  floor: number;
  apartment: string;
  tenantId?: string;
}

export class RefreshCodeDto {
  apartmentId: Types.ObjectId
  tenantId: string;
}