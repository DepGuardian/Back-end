import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(tenantId: string): Promise<User[]> {
    return this.userModel.find({ tenantId }).exec();
  }

  async findOne(id: string, tenantId: string): Promise<User> {
    return this.userModel.findOne({ _id: id, tenantId }).exec();
  }

  // Implementa otros métodos CRUD según sea necesario
}