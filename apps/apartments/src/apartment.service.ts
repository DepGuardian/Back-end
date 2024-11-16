import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateApartmentDto, RefreshCodeDto } from '@libs/dtos/apartment.dto';
import { Apartment, ApartmentSchema } from '@libs/schemas/apartment.schema';
import { DatabaseConnectionService } from '@database/database.service';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';

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

  async createApartment(
    registerData: CreateApartmentDto,
  ): Promise<ResponseDto> {
    try {
      const tenantConnection =
        await this.databaseConnectionService.getConnection(
          registerData.tenantId,
        );
      if (!tenantConnection) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.TENANT_NOT_FOUND,
        };
      }

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
        return {
          status: HttpStatus.CONFLICT,
          data: null,
          errorMessage: TypeErrors.APARTMENT_ALREADY_EXISTS,
        };
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

      // Retornar apartment
      return {
        status: HttpStatus.CREATED,
        data: savedApartment,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error registering apartment: ${error.message}`,
        error.stack,
      );

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getAll(tenantId: string): Promise<ResponseDto> {
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

      const ApartmentModel = tenantConnection.model<Apartment>(
        'Apartment',
        ApartmentSchema,
      );

      const allApartment = await ApartmentModel.find();

      return {
        status: HttpStatus.OK,
        data: allApartment,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error getting all apartments from tenant: ${tenantId}`,
        error.stack,
      );

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async refreshCode(registerData: RefreshCodeDto): Promise<ResponseDto> {
    try {
      const newCode = this.getRandomInt(100000, 999999);

      const tenantConnection =
        await this.databaseConnectionService.getConnection(
          registerData.tenantId,
        );

      if (!tenantConnection) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.TENANT_NOT_FOUND,
        };
      }

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
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.APARTMENT_NOT_FOUND,
        };
      }

      return {
        status: HttpStatus.OK,
        data: updatedApartment,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error refreshing code for apartment ID: ${registerData.apartmentId}`,
        error.stack,
      );

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
