import { Types } from 'mongoose';

export interface CreateApartmentDto {
  owner: Types.ObjectId;
  floor: number;
  apartment: string;
  tenantId?: string;
}
