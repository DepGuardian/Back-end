import { CreateApartmentDto } from '@libs/dtos/apartment.dto';
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
}
