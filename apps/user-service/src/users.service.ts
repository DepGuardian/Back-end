import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<User> {
    this.logger.log('Attempting to create user');
    try {
      const createdUser = new this.userModel(createUserDto);
      const result = await createdUser.save();
      this.logger.log('User created successfully');
      return result;
    } catch (error) {
      this.logger.error(`Error caught in create method: ${error.message}`);
      if (error.code === 11000) {
        this.logger.warn(`Duplicate key error: ${JSON.stringify(error.keyValue)}`);
        throw new ConflictException('Email already exists');
      }
      this.logger.error(`Unexpected error creating user: ${error.message}`);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async findAll(tenantId: string): Promise<User[]> {
    try {
      return this.userModel.find({ tenantId }).exec();
    } catch (error) {
      this.logger.error('SERVICE FIND ALL' + error);
      throw error;
    }
  }

  async findOne(id: string, tenantId: string): Promise<User> {
    try {
      return this.userModel.findOne({ _id: id, tenantId }).exec();
    } catch (error) {
      this.logger.error('SERVICE FIND ONE' + error);
      throw error;
    }
  }

  // Implementa otros métodos CRUD según sea necesario
}
