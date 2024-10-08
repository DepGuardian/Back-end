import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './interfaces/users.interfaces';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create_user' })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'get_users' })
  findAll(@Payload() { tenantId }: { tenantId: string }) {
    return this.usersService.findAll(tenantId);
  }

  @MessagePattern({ cmd: 'get_user' })
  findOne(@Payload() { id, tenantId }: { id: string; tenantId: string }) {
    return this.usersService.findOne(id, tenantId);
  }
}