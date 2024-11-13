import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthLoginDto } from '@libs/dtos/auth.dto';
import { RegisterResidentDto } from '@libs/dtos/resident.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @MessagePattern({ cmd: 'login' })
  async login(data: AuthLoginDto): Promise<any> {
    try {
      return this.authService.login(data);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'registerSuperAdmin' })
  async registerSuperAdmin(data: {
    email: string;
    password: string;
    tenantId: string;
  }): Promise<any> {
    try {
      return this.authService.registerSuperAdmin(data);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'registerResident' })
  async registerResident(data: RegisterResidentDto) {
    return this.authService.registerResident(data);
  }
}
