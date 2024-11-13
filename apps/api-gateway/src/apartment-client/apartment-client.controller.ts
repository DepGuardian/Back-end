import {
  Body,
  ConflictException,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Put
} from '@nestjs/common';
import { CreateApartmentDto, RefreshCodeDto } from '@libs/dtos/apartment.dto';
import { ApartmentClientService } from './apartment-client.service';

@Controller('apartment')
export class ApartmentClientController {
  private readonly logger = new Logger(ApartmentClientController.name);

  constructor(
    private readonly apartmentClientService: ApartmentClientService,
  ) {}

  @Post('createApartment')
  async createApartment(@Body() registerData: CreateApartmentDto) {
    try {
      this.logger.debug(
        `Attempting to register resident with apartment: ${registerData.apartment} for tenant: ${registerData.tenantId}`,
      );

      const response =
        await this.apartmentClientService.createApartment(registerData);

      this.logger.debug(
        `Resident registered successfully with apartment: ${registerData.apartment}`,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Failed to register resident with apartment: ${registerData.apartment}`,
        error.stack,
      );

      if (error instanceof ConflictException) {
        throw new ConflictException('Apartment already exists');
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Tenant not found');
      }

      throw new HttpException(
        'Error registering apartment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(`refreshCode`)
  async refreshCode(@Body() registerData: RefreshCodeDto) {
    try {
      this.logger.debug(
        `Attempting to refresh code for apartment id (${registerData.apartmentId}) in tenant(${registerData.tenantId})`,
      );

      const response =
        await this.apartmentClientService.refreshCode(registerData);

      this.logger.debug(
        `Code Updated successfully to apartment with Id: (${registerData.apartmentId}) in tenant(${registerData.tenantId})`,
      );

      this.logger.log(response)

      return response;
    } catch (error) {
      this.logger.error(
        `Failed to update code for apartment with Id: (${registerData.apartmentId}) in tenant(${registerData.tenantId})`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw new NotFoundException('apartment not found');
      }

      throw new HttpException(
        'Error updating Apartment code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }  


}
