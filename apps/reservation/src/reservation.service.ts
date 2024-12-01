import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import {
  CreateReservationDto,
  DeleteReservationDto,
} from '@libs/dtos/reservation.dto';
import {
  Reservation,
  ReservationSchema,
} from '@libs/schemas/reservation.schema';
import { DatabaseConnectionService } from '@database/database.service';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);

  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  private getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

  async createReservation(
    registerData: CreateReservationDto,
  ): Promise<ResponseDto> {
    console.log(registerData);
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
      const ReservationModel = tenantConnection.model<Reservation>(
        'Reservation',
        ReservationSchema,
      );

      // Verificamos si ya existe una reservacion en el mismo lugar y dentro del intervalo (casos: mismo inicio, mismo inicio-final, mismo final)

      const middleTime = new Date(registerData.start_time);
      middleTime.setHours(
        new Date(registerData.end_time).getHours() -
          new Date(registerData.start_time).getHours(),
      );
      middleTime.setMinutes(
        new Date(registerData.end_time).getMinutes() -
          new Date(registerData.start_time).getMinutes() / 2,
      );

      const existingReservationStart = await ReservationModel.findOne({
        id_common_area: registerData.id_common_area,
        time_interval: {
          start: new Date(registerData.start_time),
          end: middleTime,
        },
      });

      const existingReservationSame = await ReservationModel.findOne({
        id_common_area: registerData.id_common_area,
        time_interval: {
          start: new Date(registerData.start_time),
          end: new Date(registerData.end_time),
        },
      });

      const existingReservationEnd = await ReservationModel.findOne({
        id_common_area: registerData.id_common_area,
        time_interval: {
          start: middleTime,
          end: new Date(registerData.end_time),
        },
      });

      if (existingReservationSame) {
        return {
          status: HttpStatus.CONFLICT,
          data: null,
          errorMessage: TypeErrors.INVALID_INTERVAL, // need new type error
        };
      }
      if (existingReservationStart) {
        return {
          status: HttpStatus.CONFLICT,
          data: null,
          errorMessage: TypeErrors.RESERVATION_IN_CONFLICT, // need new type error
        };
      }

      if (existingReservationEnd) {
        return {
          status: HttpStatus.CONFLICT,
          data: null,
          errorMessage: TypeErrors.RESERVATION_IN_CONFLICT, // need new type error
        };
      }

      // Crear reserva
      const newReservation = new ReservationModel({
        id_common_area: registerData.id_common_area,
        id_host: registerData.id_host,
        time_interval: {
          start: new Date(registerData.start_time),
          end: new Date(registerData.end_time),
        },
      });

      // Guardar en la base de datos
      const savedReservation = await newReservation.save();

      // Retornar apartment
      return {
        status: HttpStatus.CREATED,
        data: savedReservation,
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

      const ReservationModel = tenantConnection.model<Reservation>(
        'Reservation',
        ReservationSchema,
      );

      const allReservations = await ReservationModel.find();

      return {
        status: HttpStatus.OK,
        data: allReservations,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error getting all reservations from tenant: ${tenantId}`,
        error.stack,
      );

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async deleteReservation(data: DeleteReservationDto): Promise<ResponseDto> {
    try {
      const tenantConnection =
        await this.databaseConnectionService.getConnection(data.tenantId);

      if (!tenantConnection) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.TENANT_NOT_FOUND,
        };
      }

      const ReservationModel = tenantConnection.model<Reservation>(
        'Reservation',
        ReservationSchema,
      );

      const deletedReservation = await ReservationModel.findByIdAndDelete(
        data.id,
      );

      if (!deletedReservation) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.RESERVATION_NOT_FOUND,
        };
      }

      return {
        status: HttpStatus.OK,
        data: deletedReservation,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error deleting reservation: ${error.message}`,
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
