import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { CreateDepartmentDto } from './interfaces/department.interfaces';

@Injectable()
export class DepartmentService {
  private readonly logger = new Logger(DepartmentService.name);

  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    this.logger.log('Attempting to create department');
    try {
      const createdDepartment = new this.departmentModel(createDepartmentDto);
      const result = await createdDepartment.save();
      this.logger.log('Department created successfully');
      return result;
    } catch (error) {
      this.logger.error(`Error caught in create method: ${error.message}`);
      if (error.code === 11000) {
        this.logger.warn(
          `Duplicate key error: ${JSON.stringify(error.keyValue)}`,
        );
        throw new ConflictException('Department Identifier already exists');
      }
      this.logger.error(`Unexpected error creating department: ${error.message}`);
      throw new InternalServerErrorException('Could not create department');
    }
  }

  async findAll(): Promise<Department[]> {
    try {
      return this.departmentModel.find().exec();
    } catch (error) {
      this.logger.error('SERVICE FIND ALL' + error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Department> {
    try {
      return this.departmentModel.findOne({ _id: id }).exec();
    } catch (error) {
      this.logger.error('SERVICE FIND ONE' + error);
      throw error;
    }
  }

  // Implementa otros métodos CRUD según sea necesario
}
