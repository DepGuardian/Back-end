import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateApartmentDto, RefreshCodeDto } from '@libs/dtos/apartment.dto';
import { ApartmentService } from './apartment.service';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';

@Controller()
export class ApartmentController {
  private readonly logger = new Logger(ApartmentController.name);
  constructor(private readonly apartmentService: ApartmentService) {}

  @MessagePattern({ cmd: 'createApartment' })
  async createApartment(data: CreateApartmentDto) {
    try {
      const response: ResponseDto =
        await this.apartmentService.createApartment(data);
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

  @MessagePattern({ cmd: 'refreshCode' })
  async refreshCode(data: RefreshCodeDto) {
    try {
      const response: ResponseDto =
        await this.apartmentService.refreshCode(data);
      return response;
    } catch (error) {
      this.logger.error('Error refreshing code:', error);
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
        await this.apartmentService.getAll(tenantId);
      return response;
    } catch (error) {
      this.logger.error('Error fetching apartments:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
