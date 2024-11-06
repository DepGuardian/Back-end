import { ObjectId } from "mongoose";

export interface CreateCondominiumDto {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    totalUnits: number;
    totalFloors: number;
    totalParking: number;
    totalResidents: number;
    totalEmployees: number;
    tenantId: string;
    superAdminId: ObjectId;
}