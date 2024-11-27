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
import { CreateCommonAreaDto,DeleteCommonAreaDto,GetByNameDto,GetByStatusDto} from '@libs/dtos/common_area.dto';
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
    try{
      if(!tenantId){
        throw new HttpException(
          'TenantId is required',
          HttpStatus.BAD_REQUEST,
        );
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
    @Query() data: GetByStatusDto ,@Res() res: any) {
    try {
      if(!data.tenantId || !status){
        throw new HttpException(
          'TenantId and status are required',
          HttpStatus.BAD_REQUEST,
        );
      }
      this.logger.log(
        `Get all common areas for TenantId ${data.tenantId} with status: ${data.status}`,
        `GET /commonarea?tenantId=${data.tenantId}?status=${data.status}`,
      );

      const response = await this.commonAreaClientService.getByStatus(data);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Failed to get common area in tenant(${data.tenantId}) with status: ${data.status}`,
        error.stack,
      );
      throw new HttpException(
        'Error getting common areas specified',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getByName(@Query() data: GetByNameDto ,@Res() res: any) {
    try {
      if(!data.tenantId || !data.name){
        throw new HttpException(
          'TenantId and status are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.log(
        `Get all common areas for TenantId ${data.tenantId} with name: ${data.name}`,
        `GET /commonarea?tenantId=${data.tenantId}?name=${data.name}`,
      );

      const response = await this.commonAreaClientService.getByName(data);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Failed to get common area in tenant(${data.tenantId}) with name: ${name}`,
        error.stack,
      );
      throw new HttpException(
        'Error getting common areas specified',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Delete()
  async deleteCommonArea(data: DeleteCommonAreaDto) {
    try {
      const response: Response =
        await this.commonAreaClientService.deleteCommonArea(data);
      return response;
    } catch (error) {
      this.logger.error('Error deleting common area:', error);
      throw new HttpException(
        'Error deleting common area',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
