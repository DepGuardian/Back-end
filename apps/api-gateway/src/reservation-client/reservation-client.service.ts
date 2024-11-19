import { CreateReservationDto } from '@libs/dtos/reservation.dto';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReservationClientService {
  private readonly logger = new Logger(ReservationClientService.name);
  constructor(
    @Inject('RESERVATION_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async createReservation(registerData: CreateReservationDto) {
    try {
      const pattern = { cmd: 'createReservation' };
      return firstValueFrom(this.authClient.send(pattern, registerData));
    } catch (error) {
      this.logger.error('Failed to create reservation', error.stack);
      throw new Error(error);
    }
  }

  async getAll(tenantId: string) {
    try {
      const pattern = { cmd: 'getAll' };
      return firstValueFrom(this.authClient.send(pattern, tenantId));
    } catch (error) {
      this.logger.error('Failed to retrieve reservations', error.stack);
      throw new Error(error);
    }
  }
}
