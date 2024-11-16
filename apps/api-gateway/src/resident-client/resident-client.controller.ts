import {
  Controller,
  Logger,
  Get,
  Query,
  HttpException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ResponseDto } from '@libs/dtos/response.dto';
import { ResidentClientService } from './resident-client.service';

@Controller('resident')
export class ResidentClientController {
  private readonly logger = new Logger(ResidentClientController.name);

  constructor(private readonly residentClientService: ResidentClientService) {}

  @Get()
  async getResidents(@Query('tenantId') tenantId: string, @Res() res: any) {
    try {
      this.logger.log(
        `Get all residents for TenantId ${tenantId}`,
        `GET /resident?tenantId=${tenantId}`,
      );
      const response: ResponseDto =
        await this.residentClientService.getResidents(tenantId);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(`Failed to retrieve residents`, error.stack);
      throw new HttpException(
        'Failed to retrieve residents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
