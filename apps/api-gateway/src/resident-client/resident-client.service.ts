import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ResidentClientService {
  constructor(
    @Inject('RESIDENT_SERVICE') private readonly residentClient: ClientProxy,
  ) {}

  async getResidents(tenantId: string) {
    try {
      const pattern = { cmd: 'getall' };
      return firstValueFrom(this.residentClient.send(pattern, tenantId));
    } catch (error) {
      throw error;
    }
  }
}
