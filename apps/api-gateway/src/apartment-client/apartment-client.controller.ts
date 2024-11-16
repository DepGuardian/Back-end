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
import { CreateApartmentDto, RefreshCodeDto } from '@libs/dtos/apartment.dto';
import { ApartmentClientService } from './apartment-client.service';

@Controller('apartment')
export class ApartmentClientController {
  private readonly logger = new Logger(ApartmentClientController.name);

  constructor(
    private readonly apartmentClientService: ApartmentClientService,
  ) {}

  @Post()
  async createApartment(
    @Body() registerData: CreateApartmentDto,
    @Res() res: any,
  ) {
    try {
      this.logger.log(
        `Create apartment with data: ${JSON.stringify(registerData)}`,
        `POST /apartment`,
      );
      const response =
        await this.apartmentClientService.createApartment(registerData);
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

      const response = await this.apartmentClientService.getAll(tenantId);
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

  @Post(`refreshCode`)
  async refreshCode(@Body() registerData: RefreshCodeDto, @Res() res: any) {
    try {
      this.logger.log(
        `Update code for apartment with Id: (${registerData.apartmentId}) in tenant(${registerData.tenantId})`,
        `POST /apartment/refreshCode`,
      );
      const response =
        await this.apartmentClientService.refreshCode(registerData);

      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Failed to update code for apartment with Id: (${registerData.apartmentId}) in tenant(${registerData.tenantId})`,
        error.stack,
      );

      throw new HttpException(
        'Error updating Apartment code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
