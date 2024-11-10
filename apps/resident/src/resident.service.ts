import { Connection } from 'mongoose';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DatabaseConnectionService } from '@database/database.service';
import { Resident, ResidentSchema } from '@libs/schemas/resident.schema';

@Injectable()
export class ResidentService implements OnModuleInit {
  private readonly logger = new Logger(ResidentService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  async onModuleInit() {
    // Verificar la conexión al iniciar el servicio
    this.logger.debug(
      `MongoDB URI: ${this.configService.get<string>('MONGODB_URI')}`,
    );
    this.logger.debug(
      `Connected to database: ${this.connection.db.databaseName}`,
    );

    // Verificar que estamos en la base de datos correcta
    if (this.connection.db.databaseName !== 'general') {
      this.logger.error(
        'Connected to wrong database! Expected "general" but got "' +
          this.connection.db.databaseName +
          '"',
      );
      throw new Error('Wrong database connection');
    }

    // Listar todas las colecciones para verificar
    const collections = await this.connection.db.listCollections().toArray();
    this.logger.debug(
      'Available collections: ' + collections.map((c) => c.name).join(', '),
    );
  }

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
