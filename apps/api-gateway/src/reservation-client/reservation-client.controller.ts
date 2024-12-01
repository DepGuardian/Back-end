import {
  Body,
  Query,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Get,
  Post,
  Delete,
  Res,
} from '@nestjs/common';
import { CreateReservationDto, DeleteReservationDto} from '@libs/dtos/reservation.dto';
import { ReservationClientService } from './reservation-client.service';

@Controller('reservation')
export class ReservationClientController {
  private readonly logger = new Logger(ReservationClientController.name);

  constructor(
    private readonly reservationClientService: ReservationClientService,
  ) {}

  @Post()
  async createReservation(
    @Body() registerData: CreateReservationDto,
    @Res() res: any,
  ) {
    try {
      this.logger.log(
        `Create reservation with data: ${JSON.stringify(registerData)}`,
        `POST /reservation`,
      );
      const response =
        await this.reservationClientService.createReservation(registerData);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error('Failed to create reservation', error.stack);
      throw new HttpException(
        'Error creating reservation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAll(@Query(`tenantId`) tenantId: string, @Res() res: any) {
    try {
      this.logger.log(
        `Get all reservations for TenantId ${tenantId}`,
        `GET /reservation?tenantId=${tenantId}`,
      );

      const response = await this.reservationClientService.getAll(tenantId);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Failed to get reservations in tenant(${tenantId})`,
        error.stack,
      );
      throw new HttpException(
        'Error getting all reservations from tenant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Delete()
  async deleteReservation(
    @Body() registerData: DeleteReservationDto,
    @Res() res: any,
  ) {
    try {
      this.logger.log(
        `Delete reservation with data: ${JSON.stringify(registerData)}`,
        `DELETE /reservation`,
      );
      const response =
        await this.reservationClientService.deleteReservation(registerData);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error('Failed to delete reservation', error.stack);
      throw new HttpException(
        'Error deleting reservation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
}
