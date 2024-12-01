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
  Delete,
} from '@nestjs/common';
import {
  CreateCommonAreaDto,
  DeleteCommonAreaDto,
  GetByNameDto,
  GetByStatusDto,
  UpdateCommonAreaDto,
} from '@libs/dtos/common_area.dto';
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

  @Get('all')
  async getAll(@Query(`tenantId`) tenantId: string, @Res() res: any) {
    try {
      if (!tenantId) {
        throw new HttpException('TenantId is required', HttpStatus.BAD_REQUEST);
      }
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

  @Get('status')
  async getByStatus(
    @Query('status') status: string,
    @Query('tenantId') tenantId: string,
    @Res() res: any,
  ) {
    try {
      if (!tenantId || !status) {
        throw new HttpException(
          'TenantId and status are required',
          HttpStatus.BAD_REQUEST,
        );
      }
      this.logger.log(
        `Get all common areas for TenantId ${tenantId} with status: ${status}`,
        `GET /commonarea?tenantId=${tenantId}?status=${status}`,
      );

      const response = await this.commonAreaClientService.getByStatus({
        status,
        tenantId,
      });
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

  @Get()
  async getByName(
    @Query('name') name: string,
    @Query('tenantId') tenantId: string,
    @Res() res: any,
  ) {
    try {
      if (!tenantId || !name) {
        throw new HttpException(
          'TenantId and status are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.log(
        `Get all common areas for TenantId ${tenantId} with name: ${name}`,
        `GET /commonarea?tenantId=${tenantId}?name=${name}`,
      );

      const response = await this.commonAreaClientService.getByName({
        tenantId,
        name,
      });
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Failed to get common area in tenant(${tenantId}) with name: ${name}`,
        error.stack,
      );
      throw new HttpException(
        'Error getting common areas specified',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Delete()
  async deleteCommonArea(
    @Query('id') id: string,
    @Query('tenantId') tenantId: string,
    @Res() res: any,
  ) {
    console.log(id, tenantId);
    try {
      const response: Response =
        await this.commonAreaClientService.deleteCommonArea({ id, tenantId });
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error('Error deleting common area:', error);
      throw new HttpException(
        'Error deleting common area',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('update')
  async updateCommonArea(@Body() data: UpdateCommonAreaDto, @Res() res: any) {
    console.log(data);
    try {
      const response: Response =
        await this.commonAreaClientService.updateCommonArea(data);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error('Error updating common area:', error);
      throw new HttpException(
        'Error updating common area',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
