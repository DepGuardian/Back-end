import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthLoginDto, AuthRegisterSuperAdminDto } from '@libs/dtos/auth.dto';
import { RegisterResidentDto } from '@libs/dtos/resident.dto';
import { AuthService } from './auth.service';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}
  @MessagePattern({ cmd: 'login' })
  async login(data: AuthLoginDto) {
    try {
      const response: ResponseDto = await this.authService.login(data);
      return response;
    } catch (error) {
      this.logger.error('Error logging in:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @MessagePattern({ cmd: 'registerSuperAdmin' })
  async registerSuperAdmin(data: AuthRegisterSuperAdminDto) {
    try {
      const response: ResponseDto =
        await this.authService.registerSuperAdmin(data);
      return response;
    } catch (error) {
      this.logger.error('Error registering super admin:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @MessagePattern({ cmd: 'registerResident' })
  async registerResident(data: RegisterResidentDto) {
    try {
      const response: ResponseDto =
        await this.authService.registerResident(data);
      return response;
    } catch (error) {
      this.logger.error('Error registering resident:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
