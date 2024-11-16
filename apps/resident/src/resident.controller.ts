import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';

@Controller()
export class ResidentController {
  constructor(private readonly residentServide: ResidentService) {}
  @MessagePattern({ cmd: 'getAll' })
  async getAll(tenantId: string) {
    try {
      const response: ResponseDto =
        await this.residentServide.getAllResidents(tenantId);
      return response;
    } catch (error) {
      console.error('Error fetching residents:', error);
      return {
        status: 500,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
