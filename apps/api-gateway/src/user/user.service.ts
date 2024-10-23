import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { User, UserSchema } from './user.schema';
import { SuperAdmin } from '../superadmin-dashboard/superadmin.schema';
import { DatabaseConnectionService } from '../database/database-connection.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(SuperAdmin.name) private readonly superAdminModel: Model<SuperAdmin>,
    private readonly dbService: DatabaseConnectionService
  ) {}

  async findSuperAdminByEmail(email: string): Promise<SuperAdmin | null> {
    return this.superAdminModel.findOne({ email }).exec();
  }

  async findResidentByEmail(email: string, tenantId: string): Promise<User | null> {
    const connection = await this.dbService.getConnection(tenantId);
    const UserModel = connection.model<User>('User', UserSchema);
    return UserModel.findOne({ email }).exec();
  }

  async createSuperAdmin(userData: any): Promise<SuperAdmin> {
    const hashedPassword = await argon2.hash(userData.password);
    const newSuperAdmin = new this.superAdminModel({
      ...userData,
      password: hashedPassword,
      isSuperAdmin: true
    });
    return newSuperAdmin.save();
  }

  async createResident(userData: any, tenantId: string): Promise<User> {
    try {
      const connection = await this.dbService.getConnection(tenantId);
      const UserModel = connection.model<User>('users', UserSchema);
      
      const hashedPassword = await argon2.hash(userData.password);
      const newUser = new UserModel({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        department: userData.department,
        tenantId,
      });
      
      return newUser.save();
    } catch (error) {
      console.error('Error creating resident:', error);
      throw new UnauthorizedException('Error creating resident', error);
    }
  }

  async comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return argon2.verify(hashedPassword, plainTextPassword);
  }
}