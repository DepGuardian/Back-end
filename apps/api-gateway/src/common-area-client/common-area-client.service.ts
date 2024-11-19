import { CreateCommonAreaDto } from '@libs/dtos/common_area.dto';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommonAreaClientService {
  private readonly logger = new Logger(CommonAreaClientService.name);
  constructor(
    @Inject('COMMON_AREA_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async createCommonArea(registerData: CreateCommonAreaDto) {
    try {
      const pattern = { cmd: 'createCommonArea' };
      return firstValueFrom(this.authClient.send(pattern, registerData));
    } catch (error) {
      this.logger.error('Failed to create common area', error.stack);
      throw new Error(error);
    }
  }

  async getAll(tenantId: string) {
    try {
      const pattern = { cmd: 'getAll' };
      return firstValueFrom(this.authClient.send(pattern, tenantId));
    } catch (error) {
      this.logger.error('Failed to retrieve common areas', error.stack);
      throw new Error(error);
    }
  }
}
