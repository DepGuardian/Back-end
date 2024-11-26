import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateCommonAreaDto } from '@libs/dtos/common_area.dto';
import { CommonArea, CommonAreaSchema } from '@libs/schemas/common_area.schema';
import { DatabaseConnectionService } from '@database/database.service';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';
import { register } from 'module';

@Injectable()
export class CommonAreaService {
  private readonly logger = new Logger(CommonAreaService.name);

  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  private getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

  async createCommonArea(
    registerData: CreateCommonAreaDto,
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

      // Creamos el modelo de CommonArea para esta conexión específica
      const CommonAreaModel = tenantConnection.model<CommonArea>(
        'CommonArea',
        CommonAreaSchema,
      );

      // Verificamos si el nombre de sala comun ya existe
      const existingCommonArea = await CommonAreaModel.findOne({
        name: registerData.name,
      });

      if (existingCommonArea) {
        return {
          status: HttpStatus.CONFLICT,
          data: null,
          errorMessage: TypeErrors.APARTMENT_ALREADY_EXISTS,
        };
      }

      // Crear common area
      const newCommonArea = new CommonAreaModel({
        name:registerData.name,
        description: registerData.description,
        capacity: registerData.capacity,
        status: registerData.status,
      });

      // Guardar en la base de datos
      const savedCommonArea = await newCommonArea.save();

      // Retornar common area
      return {
        status: HttpStatus.CREATED,
        data: savedCommonArea,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error registering common area: ${error.message}`,
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

      const CommonAreaModel = tenantConnection.model<CommonArea>(
        'CommonArea',
        CommonAreaSchema,
      );

      const allCommonArea = await CommonAreaModel.find();

      return {
        status: HttpStatus.OK,
        data: allCommonArea,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error getting all common areas from tenant: ${tenantId}`,
        error.stack,
      );

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getByStatus(tenantId: string, status: string): Promise<ResponseDto> {
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

      const CommonAreaModel = tenantConnection.model<CommonArea>(
        'CommonArea',
        CommonAreaSchema,
      );

      const CommonAreaByStatus = await CommonAreaModel.findById(status); // asi?

      return {
        status: HttpStatus.OK,
        data: CommonAreaByStatus,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error getting all common areas from tenant: ${tenantId}`,
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
