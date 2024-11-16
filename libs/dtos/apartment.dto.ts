import { Types } from 'mongoose';

export interface CreateApartmentDto {
  owner: string;
  floor: number;
  apartment: string;
  tenantId?: string;
}

export class RefreshCodeDto {
  apartmentId: Types.ObjectId;
  tenantId: string;
}
