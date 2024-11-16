import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseConnectionService } from '@database/database.service';
import { Resident, ResidentSchema } from '@libs/schemas/resident.schema';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';

@Injectable()
export class ResidentService {
  private readonly logger = new Logger(ResidentService.name);

  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  async getAllResidents(tenantId: string): Promise<ResponseDto> {
    try {
      const tenantConnection =
        await this.databaseConnectionService.getConnection(tenantId);
      if (!tenantConnection) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.TENANT_NOT_FOUND,
        };
      }
      const ResidentModel = tenantConnection.model<Resident>(
        'Resident',
        ResidentSchema,
      );
      return {
        status: HttpStatus.OK,
        data: await ResidentModel.find().select('-password').exec(),
        errorMessage: null,
      };
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
