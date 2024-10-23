import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SuperAdmin } from './superadmin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SuperAdminDashboardService {
  constructor(
    @InjectModel(SuperAdmin.name) private readonly superAdminModel: Model<SuperAdmin>,
  ) {}

  async getCondominium(superAdminId: string) {
    const superAdmin =  await this.superAdminModel.findById(superAdminId).populate('condominiumId').exec();
    return superAdmin;
  }w
}