import { ObjectId } from "mongoose";

export interface SuperAdminCreateDto {
  name: string;
  email: string;
  password: string;
  isSuperAdmin: boolean;
  condominiumId?: ObjectId;
}