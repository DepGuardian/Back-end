import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateCommonAreaDto,} from '@libs/dtos/common_area.dto';
import { CommonAreaService } from './common_area.service';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';

@Controller()
export class CommonAreaController {
  private readonly logger = new Logger(CommonAreaController.name);
  constructor(private readonly commonAreaService: CommonAreaService) {}

  @MessagePattern({ cmd: 'createCommonArea' })
  async createCommonArea(data: CreateCommonAreaDto) {
    try {
      const response: ResponseDto =
        await this.commonAreaService.createCommonArea(data);
      return response;
    } catch (error) {
      this.logger.error('Error creating common area:', error);
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
        await this.commonAreaService.getAll(tenantId);
      return response;
    } catch (error) {
      this.logger.error('Error fetching common areas:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @MessagePattern({ cmd: 'getByStatus' })
  async getByStatus(tenantId: string, status: string) {
    try {
      const response: ResponseDto =
        await this.commonAreaService.getByStatus(tenantId,status);
      return response;
    } catch (error) {
      this.logger.error('Error fetching common areas:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
