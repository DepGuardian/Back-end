import { MessagePattern } from '@nestjs/microservices';
import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';
import { ResidentService } from './resident.service';

@Controller()
export class ResidentController {
  private readonly logger = new Logger(ResidentController.name);
  constructor(private readonly residentServide: ResidentService) {}
  @MessagePattern({ cmd: 'getAll' })
  async getAll(tenantId: string) {
    try {
      const response: ResponseDto =
        await this.residentServide.getAllResidents(tenantId);
      return response;
    } catch (error) {
      this.logger.error('Error fetching residents:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
