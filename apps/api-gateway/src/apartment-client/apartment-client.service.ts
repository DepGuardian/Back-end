import { CreateApartmentDto, RefreshCodeDto } from '@libs/dtos/apartment.dto';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApartmentClientService {
  private readonly logger = new Logger(ApartmentClientService.name);
  constructor(
    @Inject('APARTMENT_SERVICE') private readonly apartmentClient: ClientProxy,
  ) {}

  async createApartment(registerData: CreateApartmentDto) {
    try {
      const pattern = { cmd: 'createApartment' };
      return firstValueFrom(this.apartmentClient.send(pattern, registerData));
    } catch (error) {
      this.logger.error('Failed to create apartment', error.stack);
      throw new Error(error);
    }
  }

  async refreshCode(registerData: RefreshCodeDto) {
    try {
      const pattern = { cmd: 'refreshCode' };
      return firstValueFrom(this.apartmentClient.send(pattern, registerData));
    } catch (error) {
      this.logger.error('Failed to refresh code', error.stack);
      throw new Error(error);
    }
  }

  async getAll(tenantId: string) {
    try {
      const pattern = { cmd: 'getAll' };
      return firstValueFrom(this.apartmentClient.send(pattern, tenantId));
    } catch (error) {
      this.logger.error('Failed to retrieve apartments', error.stack);
      throw new Error(error);
    }
  }
}
