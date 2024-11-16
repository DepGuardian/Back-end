import { AuthRegisterSuperAdminDto } from '@libs/dtos/auth.dto';
import { RegisterResidentDto } from '@libs/dtos/resident.dto';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthClientService {
  private readonly logger = new Logger(AuthClientService.name);
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async login(data: any) {
    try {
      const pattern = { cmd: 'login' };
      return firstValueFrom(this.authClient.send(pattern, data));
    } catch (error) {
      this.logger.error('Failed to login', error.stack);
      throw new Error(error);
    }
  }

  async registerSuperAdmin(data: AuthRegisterSuperAdminDto) {
    try {
      const pattern = { cmd: 'registerSuperAdmin' };
      return firstValueFrom(this.authClient.send(pattern, data));
    } catch (error) {
      this.logger.error('Failed to register superadmin', error.stack);
      throw new Error(error);
    }
  }

  async registerResident(registerData: RegisterResidentDto) {
    try {
      const pattern = { cmd: 'registerResident' };
      return firstValueFrom(this.authClient.send(pattern, registerData));
    } catch (error) {
      this.logger.error('Failed to register resident', error.stack);
      throw new Error(error);
    }
  }
}
