import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ResidentClientService {
  private readonly logger = new Logger(ResidentClientService.name);
  constructor(
    @Inject('RESIDENT_SERVICE') private readonly residentClient: ClientProxy,
  ) {}

  async getResidents(tenantId: string) {
    try {
      const pattern = { cmd: 'getAll' };
      return firstValueFrom(this.residentClient.send(pattern, tenantId));
    } catch (error) {
      this.logger.error(`Failed to retrieve residents`, error.stack);
      throw new Error(error);
    }
  }
}
