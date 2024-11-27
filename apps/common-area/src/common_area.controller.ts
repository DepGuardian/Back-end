import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateCommonAreaDto, GetByStatusDto, GetByNameDto, DeleteCommonAreaDto} from '@libs/dtos/common_area.dto';
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
      this.logger.log("creando common area")
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
      if (!tenantId) {
        this.logger.error('tenantId is required');
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          errorMessage: 'tenantId is required',
        };
      }
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
  async getByStatus(data: GetByStatusDto) {
    try {
      const { tenantId, status } = data;
      if (!tenantId || !status) { 
        this.logger.error('tenantId and status are required');
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          errorMessage: 'tenantId and status are required',
        };
      }
      const response: ResponseDto =
        await this.commonAreaService.getByStatus(data);
      return response;
    } catch (error) {
      this.logger.error(`Error fetching common areas for tenantId: ${data.tenantId} and status: ${data.status}`,
        error.stack);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @MessagePattern({cmd: `getByName`})
  async getByName(data: GetByNameDto) {
    try {
      const{tenantId, name} = data;
      if (!tenantId || !name) {
        this.logger.error('tenantId and name are required');
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          errorMessage: 'tenantId and name are required',
        };
      }
      const response: ResponseDto =
        await this.commonAreaService.getByName(data);
      return response;
    } catch (error) {
      this.logger.error(`Error fetching common areas for tenantId: ${data.tenantId} and name: ${data.name}`, error.stack);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @MessagePattern({cmd: `deleteCommonArea`})
  async deleteCommonArea(data: DeleteCommonAreaDto) {
    try {
      const response: ResponseDto =
        await this.commonAreaService.deleteCommonArea(data);
      return response;
    } catch (error) {
      this.logger.error('Error deleting common area:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
