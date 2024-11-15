import { Injectable, Logger } from '@nestjs/common';
import { DatabaseConnectionService } from '@database/database.service';
import { Resident, ResidentSchema } from '@libs/schemas/resident.schema';

@Injectable()
export class ResidentService {
  private readonly logger = new Logger(ResidentService.name);

  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  async getAllResidents(tenantId: string) {
    const tenantConnection =
      await this.databaseConnectionService.getConnection(tenantId);
    const ResidentModel = tenantConnection.model<Resident>(
      'Resident',
      ResidentSchema,
    );
    return ResidentModel.find().select('-password').exec();
  }
}
