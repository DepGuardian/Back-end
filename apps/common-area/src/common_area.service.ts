import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateCommonAreaDto, GetByNameDto, GetByStatusDto, DeleteCommonAreaDto } from '@libs/dtos/common_area.dto';
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

  // Método privado para obtener la conexión y el modelo
  private async getCommonAreaModel(tenantId: string) {
    const tenantConnection =
      await this.databaseConnectionService.getConnection(tenantId);

    if (!tenantConnection) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        errorMessage: TypeErrors.TENANT_NOT_FOUND,
      };
    }

    return tenantConnection.model<CommonArea>('CommonArea', CommonAreaSchema);
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

  async getByStatus(data: GetByStatusDto): Promise<ResponseDto> {
    try {
      if (!data.status) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          errorMessage: TypeErrors.STATUS_REQUIRED,
        };
      }

      const tenantConnection =
        await this.databaseConnectionService.getConnection(data.tenantId);

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

      const CommonAreaByStatus = await CommonAreaModel.findById(data.status); // asi?

      return {
        status: HttpStatus.OK,
        data: CommonAreaByStatus,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error getting all common areas from tenant: ${data.tenantId}`,
        error.stack,
      );

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getByName(data: GetByNameDto): Promise <ResponseDto> {
    try {
      if (!data.name) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          errorMessage: TypeErrors.NAME_REQUIRED,
        };
      }
      const tenantConnection =
        await this.databaseConnectionService.getConnection(data.tenantId);

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

      const CommonAreaByName = await CommonAreaModel.findById(data.name); // asi?

      return {
        status: HttpStatus.OK,
        data: CommonAreaByName,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error getting all common areas from tenant: ${data.tenantId}`,
        error.stack,
      );

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // Método para eliminar un área común por ID
  async deleteCommonArea(data: DeleteCommonAreaDto ): Promise<ResponseDto> {
    const commonAreaModel = await this.getCommonAreaModel(data.tenantId);

    if (!commonAreaModel || 'status' in commonAreaModel) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        errorMessage: TypeErrors.TENANT_NOT_FOUND,
      };
    }

    try {
      const result = await commonAreaModel.findByIdAndDelete(data.id);
      if (!result) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.COMMON_AREA_NOT_FOUND,
        };
      }

      return {
        status: HttpStatus.OK,
        data: result,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(`Error deleting common area: ${error.message}`);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
