import {
  ConflictException,
  Controller,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create_user' })
  async create(@Payload() createUserDto: any) {
    this.logger.log('Received create user request');
    try {
      const result = await this.usersService.create(createUserDto);
      this.logger.log('User created successfully');
      return result;
    } catch (error) {
      this.logger.error(`Error in create user controller: ${error.message}`);
      if (error instanceof ConflictException) {
        throw new RpcException({
          message: error.message,
          statusCode: HttpStatus.CONFLICT
        });
      }
      throw new RpcException({
        message: 'An error occurred',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  @MessagePattern({ cmd: 'get_users' })
  async findAll(@Payload() { tenantId }: { tenantId: string }) {
    try {
      return await this.usersService.findAll(tenantId);
    } catch (error) {
      this.logger.error('CONTROLLER FIND ALL' + error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'get_user' })
  async findOne(@Payload() { id, tenantId }: { id: string; tenantId: string }) {
    try {
      return await this.usersService.findOne(id, tenantId);
    } catch (error) {
      this.logger.error('CONTROLLER FIND ONE' + error);
      throw error;
    }
  }
}
