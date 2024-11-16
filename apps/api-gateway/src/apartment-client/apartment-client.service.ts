import { CreateApartmentDto, RefreshCodeDto } from '@libs/dtos/apartment.dto';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApartmentClientService {
  constructor(
    @Inject('APARTMENT_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async createApartment(registerData: CreateApartmentDto) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'createApartment' }, registerData),
    );
  }

  async refreshCode(registerData: RefreshCodeDto) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'refreshCode' }, registerData),
    );
  }

  async getAll(tenantId: string) {
    return firstValueFrom(this.authClient.send({ cmd: 'getAll' }, tenantId));
  }
}
