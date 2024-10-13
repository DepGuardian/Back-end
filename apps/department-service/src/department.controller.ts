import {
  ConflictException,
  Controller,
  HttpStatus,
  Logger,
  Res,
} from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './interfaces/department.interfaces';

@Controller()
export class DepartmentController {
  private readonly logger = new Logger(DepartmentController.name);

  constructor(private readonly departmentService: DepartmentService) {}

  @MessagePattern({ cmd: 'create_department' })
  async create(@Payload() createDepartmentDto: CreateDepartmentDto, @Res() res) {
    this.logger.log('[BIT-A-BIT] Received create department request');
    try {
      const result = await this.departmentService.create(createDepartmentDto);
      this.logger.log('Department created successfully');
      return {
        ok: true,
        message: 'Department created successfully',
        data: result,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.logger.error(`CONTROLLER CREATE DEPARTMENT: ${error.message}`);
      if (error instanceof ConflictException) {
        throw new RpcException({
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
        });
      }
      throw new RpcException({
        message: 'An error occurred',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ cmd: 'get_departments' })
  async findAll() {
    try {
      const result = await this.departmentService.findAll();
      this.logger.log('Departments found successfully');
      return {
        ok: true,
        message: 'Departments found successfully',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`CONTROLLER FIND ALL ${error.message}`);
      throw new RpcException({
        message: 'An error occurred',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @MessagePattern({ cmd: 'get_department' })
  async findOne(@Payload() { id }: { id: string; tenantId: string }) {
    try {
      const result = await this.departmentService.findOne(id);
      this.logger.log('Department found successfully');
      if (!result) {
        throw new RpcException({
          message: 'Department not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      return {
        ok: true,
        message: 'Department found successfully',
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`CONTROLLER FIND ONE ${error.message}`);

      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        throw new RpcException({
          message: 'Invalid department ID',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        message: 'An error occurred',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
