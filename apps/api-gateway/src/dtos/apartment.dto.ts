import mongoose from "mongoose";
import { ObjectId } from "mongoose";

export interface CreateApartmentDto {
    owner: ObjectId;
    floor: number;
    apartment: string;
    tenantId?: string;
};

