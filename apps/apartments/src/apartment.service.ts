import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateApartmentDto, RefreshCodeDto } from '@libs/dtos/apartment.dto';
import { Apartment, ApartmentSchema } from '@libs/schemas/apartment.schema';
import { DatabaseConnectionService } from '@database/database.service';

@Injectable()
export class ApartmentService {
  private readonly logger = new Logger(ApartmentService.name);

  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  private getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
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
          ? mongoose.Types.ObjectId.createFromHexString(registerData.owner)
          : null,
        apartment: registerData.apartment,
        code: this.getRandomInt(100000, 999999),
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

  async getAll(tenantId: string) {
    this.logger.debug(`Getting all apartments from tenant: ${tenantId}`);

    try {
      const tenantConnection =
        await this.databaseConnectionService.getConnection(tenantId);

      const ApartmentModel = tenantConnection.model<Apartment>(
        'Apartment',
        ApartmentSchema,
      );

      const allApartment = await ApartmentModel.find();

      if (!allApartment) {
        throw new NotFoundException(
          `Apartments from tenant ${tenantId} not found`,
        );
      }

      //this.logger.debug(`Successfully refreshed code for apartment ID: ${registerData.apartmentId} with new code: ${newCode}`);

      return allApartment;
    } catch (error) {
      this.logger.error(
        `Error getting all apartments from tenant: ${tenantId}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error('Error refreshing code for apartment');
    }
  }

  async refreshCode(registerData: RefreshCodeDto) {
    this.logger.debug(
      `Refreshing code for apartment ID: ${registerData.apartmentId}`,
    );

    try {
      const newCode = this.getRandomInt(100000, 999999);

      const tenantConnection =
        await this.databaseConnectionService.getConnection(
          registerData.tenantId,
        );

      const ApartmentModel = tenantConnection.model<Apartment>(
        'Apartment',
        ApartmentSchema,
      );

      const updatedApartment = await ApartmentModel.findByIdAndUpdate(
        registerData.apartmentId,
        { code: newCode },
        { new: true, useFindAndModify: false },
      );

      if (!updatedApartment) {
        throw new NotFoundException(
          `Apartment with ID ${registerData.apartmentId} not found`,
        );
      }

      //this.logger.debug(`Successfully refreshed code for apartment ID: ${registerData.apartmentId} with new code: ${newCode}`);

      return updatedApartment;
    } catch (error) {
      this.logger.error(
        `Error refreshing code for apartment ID: ${registerData.apartmentId}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error('Error refreshing code for apartment');
    }
  }
}
