import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateReservationDto } from '@libs/dtos/reservation.dto';
import { ReservationService } from './reservation.service';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';

@Controller()
export class ReservationController {
  private readonly logger = new Logger(ReservationController.name);
  constructor(private readonly reservationService: ReservationService) {}

  @MessagePattern({ cmd: 'createApartment' })
  async createReservation(data: CreateReservationDto) {
    try {
      const response: ResponseDto =
        await this.reservationService.createReservation(data);
      return response;
    } catch (error) {
      this.logger.error('Error creating apartment:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @MessagePattern({ cmd: 'getAll' })
  async getAll(tenantId: string) {
    try {
      const response: ResponseDto =
        await this.reservationService.getAll(tenantId);
      return response;
    } catch (error) {
      this.logger.error('Error fetching reservations:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
