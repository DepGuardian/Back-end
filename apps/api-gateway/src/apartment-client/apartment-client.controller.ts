import { Body, ConflictException, Controller, HttpException, HttpStatus, Logger, NotFoundException, Post, Res } from "@nestjs/common";
import { ApartmentClientService } from "./apartment-client.service";
import { CreateApartmentDto } from "src/dtos/apartment.dto";
import { RegisterResidentDto } from "@api/dtos/resident.dto";

@Controller('apartment')
export class ApartmentClientController {
  private readonly logger = new Logger(ApartmentClientController.name);

  constructor(private readonly apartmentClientService: ApartmentClientService) {}

  @Post('createApartment')
  async createApartment(@Body() registerData:  CreateApartmentDto) {
    try {
      this.logger.debug(
        `Attempting to register resident with apartment: ${registerData.apartment} for tenant: ${registerData.tenantId}`
      );
      
      const response = await this.apartmentClientService.createApartment(registerData);
      
      this.logger.debug(
        `Resident registered successfully with apartment: ${registerData.apartment}`
      );
      
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to register resident with apartment: ${registerData.apartment}`,
        error.stack
      );
      
      if (error instanceof ConflictException) {
        throw new ConflictException('Apartment already exists');
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Tenant not found');
      }
      
      throw new HttpException(
        'Error registering apartment',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}