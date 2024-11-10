import {
  Injectable,
  Logger,
  ConflictException,
  OnModuleInit,
  NotFoundException,
} from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { CreateApartmentDto } from '@libs/dtos/apartment.dto';
import { ConfigService } from '@nestjs/config';
import { Apartment, ApartmentSchema } from '@libs/schemas/apartment.schema';
import { DatabaseConnectionService } from '@database/database.service';
import mongoose from 'mongoose';

@Injectable()
export class ApartmentService implements OnModuleInit {
  private readonly logger = new Logger(ApartmentService.name);

  constructor(
    @InjectConnection() private connection: Connection,
    private configService: ConfigService,
    private databaseConnectionService: DatabaseConnectionService,
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

  async createApartment(registerData: CreateApartmentDto) {
    this.logger.debug(
      `Attempting to createApartment with : ${registerData.apartment} for tenant: ${registerData.tenantId}`,
    );

    try {
      // Obtenemos la conexión específica para el tenant
      const tenantConnection =
        await this.databaseConnectionService.getConnection(
          registerData.tenantId,
        );

      // Creamos el modelo de Apartment para esta conexión específica
      const ApartmentModel = tenantConnection.model<Apartment>(
        'Apartment',
        ApartmentSchema,
      );

      // Verificamos si el email ya existe
      const existingApartment = await ApartmentModel.findOne({
        apartment: registerData.apartment.toLowerCase(),
      });

      if (existingApartment) {
        throw new ConflictException('apartment number already exists');
      }

      // Crear el apartmente
      const newApartment = new ApartmentModel({
        floor: registerData.floor,
        owner: registerData.owner
          ? new mongoose.Types.ObjectId(registerData.owner)
          : null,
        apartment: registerData.apartment,
      });

      // Guardar en la base de datos
      const savedApartment = await newApartment.save();

      this.logger.debug(
        `Successfully registered apartment with number: ${registerData.apartment}`,
      );

      // Retornar apartment
      return savedApartment;
    } catch (error) {
      this.logger.error(
        `Error registering apartment: ${error.message}`,
        error.stack,
      );

      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error('Error registering apartment');
    }
  }
}
