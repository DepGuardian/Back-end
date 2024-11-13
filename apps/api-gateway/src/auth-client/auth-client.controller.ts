import {
  Body,
  ConflictException,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { AuthLoginDto } from '@libs/dtos/auth.dto';
import { RegisterResidentDto } from '@libs/dtos/resident.dto';
import { AuthClientService } from './auth-client.service';

@Controller('auth')
export class AuthClientController {
  private readonly logger = new Logger(AuthClientController.name);

  constructor(private readonly authClientService: AuthClientService) {}

  @Post('login')
  async login(@Body() loginData: AuthLoginDto) {
    try {
      this.logger.debug(`Attempting login for user: ${loginData.email}`);
      const response = await this.authClientService.login(loginData);
      this.logger.debug(`Login successful for user: ${loginData.email}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Login failed for user: ${loginData.email}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('registerSuperAdmin')
  async registerSuperAdmin(
    @Body() registerData: { email: string; password: string; tenantId: string },
    @Res() res,
  ) {
    try {
      this.logger.debug(
        `Attempting to register superadmin with email: ${registerData.email}`,
      );
      const response =
        await this.authClientService.registerSuperAdmin(registerData);
      this.logger.debug(
        `Superadmin registered with email: ${registerData.email}`,
      );
      return res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      this.logger.error(
        `Failed to register superadmin with email: ${registerData.email}`,
        error.stack,
      );
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('registerResident')
  async registerResident(@Body() registerData: RegisterResidentDto) {
    try {
      this.logger.debug(
        `Attempting to register resident with email: ${registerData.email} for tenant: ${registerData.tenantId}`,
      );

      const response =
        await this.authClientService.registerResident(registerData);

      this.logger.debug(
        `Resident registered successfully with email: ${registerData.email}`,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Failed to register resident with email: ${registerData.email}`,
        error.stack,
      );

      if (error instanceof ConflictException) {
        throw new ConflictException('Email already exists');
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Tenant not found');
      }

      throw new HttpException(
        'Error registering resident',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
