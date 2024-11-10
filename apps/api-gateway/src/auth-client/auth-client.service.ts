import { RegisterResidentDto } from '@libs/dtos/resident.dto';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthClientService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async login(data: any) {
    try {
      const pattern = { cmd: 'login' };
      return firstValueFrom(this.authClient.send(pattern, data));
    } catch (error) {
      throw error;
    }
  }

  async registerSuperAdmin(data: any) {
    try {
      const pattern = { cmd: 'registerSuperAdmin' };
      return firstValueFrom(this.authClient.send(pattern, data));
    } catch (error) {
      throw error;
    }
  }

  async registerResident(registerData: RegisterResidentDto) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'registerResident' }, registerData),
    );
  }
}
