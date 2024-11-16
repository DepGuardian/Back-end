import { Model, Connection } from 'mongoose';
import { Injectable, Logger, OnModuleInit, HttpStatus } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DatabaseConnectionService } from '@database/database.service';
import { User, UserDocument } from '@libs/schemas/user.schema';
import { AuthLoginDto, AuthRegisterSuperAdminDto } from '@libs/dtos/auth.dto';
import { RegisterResidentDto } from '@libs/dtos/resident.dto';
import { Resident, ResidentSchema } from '@libs/schemas/resident.schema';
import * as argon2 from 'argon2';
import { TypeErrors } from '@libs/constants/errors';
import { ResponseDto } from '@libs/dtos/response.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

  async login(loginData: AuthLoginDto): Promise<ResponseDto> {
    this.logger.debug(`Attempting login for user: ${loginData.email}`);
    return {
      status: HttpStatus.OK,
      data: null,
      errorMessage: null,
    };
  }

  async registerSuperAdmin(
    registerData: AuthRegisterSuperAdminDto,
  ): Promise<ResponseDto> {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.userModel
        .findOne({
          email: registerData.email.toLowerCase(), // Normalizar email
        })
        .exec();

      if (existingUser) {
        return {
          status: HttpStatus.CONFLICT,
          data: null,
          errorMessage: TypeErrors.EMAIL_ALREADY_EXISTS,
        };
      }

      // Hash de la contraseña usando argon2
      const hashedPassword = await argon2.hash(registerData.password, {
        type: argon2.argon2id, // Variante más segura
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 3, // Número de iteraciones
        parallelism: 1, // Número de hilos paralelos
      });

      // Crear el superadmin
      const newSuperAdmin = new this.userModel({
        email: registerData.email.toLowerCase(), // Guardar email en minúsculas
        password: hashedPassword,
        tenantId: registerData.tenantId,
      });

      // Guardar en la base de datos
      const savedUser = (await newSuperAdmin.save()).toObject();

      // Retornar usuario sin la contraseña
      const result = {
        ...savedUser,
        password: undefined,
      };

      return {
        status: HttpStatus.CREATED,
        data: result,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error registering superadmin: ${error.message}`,
        error.stack,
      );
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async registerResident(
    registerData: RegisterResidentDto,
  ): Promise<ResponseDto> {
    try {
      // Obtenemos la conexión específica para el tenant
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

      // Creamos el modelo de Resident para esta conexión específica
      const ResidentModel = tenantConnection.model<Resident>(
        'Resident',
        ResidentSchema,
      );

      // Verificamos si el email ya existe
      const existingResident = await ResidentModel.findOne({
        email: registerData.email.toLowerCase(),
      });

      if (existingResident) {
        return {
          status: HttpStatus.CONFLICT,
          data: null,
          errorMessage: TypeErrors.EMAIL_ALREADY_EXISTS,
        };
      }

      // Hash de la contraseña
      const hashedPassword = await argon2.hash(registerData.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });

      // Crear el residente
      const newResident = new ResidentModel({
        fullName: registerData.fullName,
        email: registerData.email.toLowerCase(),
        password: hashedPassword,
        apartment: registerData.apartment,
      });

      // Guardar en la base de datos
      const savedResident = (await newResident.save()).toObject();

      // Retornar residente sin la contraseña
      const result = {
        ...savedResident,
        password: undefined,
      };

      return {
        status: HttpStatus.CREATED,
        data: result,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error(
        `Error registering resident: ${error.message}`,
        error.stack,
      );

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // Método auxiliar para verificar contraseñas (lo usaremos luego para el login)
  private async verifyPassword(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (error) {
      this.logger.error('Error verifying password:', error.stack);
      return false;
    }
  }
}
