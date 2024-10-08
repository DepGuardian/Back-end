import { Controller, Get, Post, Body, Param, Headers, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from '../interfaces/users.interface';

@Controller('users')
export class UsersController {
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientProxy) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Headers('tenant-id') tenantId: string) {
    return this.userService.send({ cmd: 'create_user' }, { ...createUserDto, tenantId });
  }

  @Get()
  findAll(@Headers('tenant-id') tenantId: string) {
    return this.userService.send({ cmd: 'get_users' }, { tenantId });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('tenant-id') tenantId: string) {
    return this.userService.send({ cmd: 'get_user' }, { id, tenantId });
  }
}