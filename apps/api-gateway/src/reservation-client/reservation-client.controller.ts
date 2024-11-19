import {
  Body,
  Query,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Get,
  Post,
  Res,
} from '@nestjs/common';
import { CreateReservationDto} from '@libs/dtos/reservation.dto';
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
        `Create apartment with data: ${JSON.stringify(registerData)}`,
        `POST /apartment`,
      );
      const response =
        await this.reservationClientService.createReservation(registerData);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error('Failed to create apartment', error.stack);
      throw new HttpException(
        'Error creating apartment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAll(@Query(`tenantId`) tenantId: string, @Res() res: any) {
    try {
      this.logger.log(
        `Get all apartments for TenantId ${tenantId}`,
        `GET /apartment?tenantId=${tenantId}`,
      );

      const response = await this.reservationClientService.getAll(tenantId);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Failed to get apartments in tenant(${tenantId})`,
        error.stack,
      );
      throw new HttpException(
        'Error getting all apartments from tenant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
