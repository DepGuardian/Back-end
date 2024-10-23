import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':tenantId')
  async getUsers(@Param('tenantId') tenantId: string) {
    // Implementa la lógica para obtener todos los usuarios de un condominio específico
  }

  @Get(':tenantId/:userId')
  async getUser(@Param('tenantId') tenantId: string, @Param('userId') userId: string) {
    // Implementa la lógica para obtener un usuario específico
  }

  @Post(':tenantId')
  async createUser(@Param('tenantId') tenantId: string, @Body() userData: any) {
    // Implementa la lógica para crear un nuevo usuario
    // Asegúrate de validar los datos de entrada y manejar los errores apropiadamente
  }

  @Put(':tenantId/:userId')
  async updateUser(
    @Param('tenantId') tenantId: string,
    @Param('userId') userId: string,
    @Body() userData: any
  ) {
    // Implementa la lógica para actualizar un usuario
  }

  @Delete(':tenantId/:userId')
  async deleteUser(@Param('tenantId') tenantId: string, @Param('userId') userId: string) {
    // Implementa la lógica para eliminar un usuario
  }
}