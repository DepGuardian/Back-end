import { Controller, Logger, Get, Query } from '@nestjs/common';
import { ResidentClientService } from './resident-client.service';

@Controller('resident')
export class ResidentClientController {
  private readonly logger = new Logger(ResidentClientController.name);

  constructor(private readonly residentClientService: ResidentClientService) {}

  @Get('all')
  async getResidents(@Query('tenantId') tenantId: string) {
    try {
      this.logger.debug(
        `Attempting to get all residents for tenant: ${tenantId}`,
      );
      const response = await this.residentClientService.getResidents(tenantId);
      this.logger.debug(`Residents retrieved successfully`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to retrieve residents`, error.stack);
      throw error;
    }
  }
}
