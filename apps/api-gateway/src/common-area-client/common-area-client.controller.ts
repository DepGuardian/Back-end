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
import { CreateCommonAreaDto} from '@libs/dtos/common_area.dto';
import { CommonAreaClientService } from './common-area-client.service';

@Controller('commonarea')
export class CommonAreaClientController {
  private readonly logger = new Logger(CommonAreaClientController.name);

  constructor(
    private readonly commonAreaClientService: CommonAreaClientService,
  ) {}

  @Post()
  async createCommonArea(
    @Body() registerData: CreateCommonAreaDto,
    @Res() res: any,
  ) {
    try {
      this.logger.log(
        `Create common area with data: ${JSON.stringify(registerData)}`,
        `POST /commonarea`,
      );
      const response =
        await this.commonAreaClientService.createCommonArea(registerData);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error('Failed to create common area', error.stack);
      throw new HttpException(
        'Error creating common area',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAll(@Query(`tenantId`) tenantId: string, @Res() res: any) {
    try {
      this.logger.log(
        `Get all common areas for TenantId ${tenantId}`,
        `GET /commonarea?tenantId=${tenantId}`,
      );

      const response = await this.commonAreaClientService.getAll(tenantId);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Failed to get common area in tenant(${tenantId})`,
        error.stack,
      );
      throw new HttpException(
        'Error getting all common areas from tenant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getByStatus(@Query(`tenantId`) tenantId: string, @Query(`status`) status:string ,@Res() res: any) {
    try {
      this.logger.log(
        `Get all common areas for TenantId ${tenantId} with status: ${status}`,
        `GET /commonarea?tenantId=${tenantId}?status=${status}`,
      );

      const response = await this.commonAreaClientService.getByStatus(tenantId,status);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Failed to get common area in tenant(${tenantId}) with status: ${status}`,
        error.stack,
      );
      throw new HttpException(
        'Error getting common areas specified',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
