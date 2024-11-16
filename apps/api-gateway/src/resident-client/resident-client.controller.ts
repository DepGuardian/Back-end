import {
  Controller,
  Logger,
  Get,
  Query,
  HttpException,
  Res,
} from '@nestjs/common';
import { ResidentClientService } from './resident-client.service';
import { ResponseDto } from '@libs/dtos/response.dto';

@Controller('resident')
export class ResidentClientController {
  private readonly logger = new Logger(ResidentClientController.name);

  constructor(private readonly residentClientService: ResidentClientService) {}

  @Get('all')
  async getResidents(@Query('tenantId') tenantId: string, @Res() res: any) {
    try {
      this.logger.log(
        `Get all residents for TenantId ${tenantId}`,
        `GET /resident/all?tenantId=${tenantId}`,
      );
      const response: ResponseDto =
        await this.residentClientService.getResidents(tenantId);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(`Failed to retrieve residents`, error.stack);
      throw new HttpException('Failed to retrieve residents', 500);
    }
  }
}
