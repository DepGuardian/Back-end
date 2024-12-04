import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { AuthLoginDto, AuthRegisterSuperAdminDto } from '@libs/dtos/auth.dto';
import { RegisterResidentDto } from '@libs/dtos/resident.dto';
import { AuthClientService } from './auth-client.service';
import { ResponseDto } from '@libs/dtos/response.dto';

@Controller('auth')
export class AuthClientController {
  private readonly logger = new Logger(AuthClientController.name);

  constructor(private readonly authClientService: AuthClientService) {}

  @Post('login')
  async login(@Body() loginData: AuthLoginDto, @Res() res: any) {
    try {
      this.logger.log(
        `Login user with email: ${loginData.email}`,
        `POST /auth/login`,
      );
      const response: ResponseDto =
        await this.authClientService.login(loginData);
      this.logger.debug(`Login successful for user: ${loginData.email}`);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Login failed for user: ${loginData.email}`,
        error.stack,
      );
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('registerSuperAdmin')
  async registerSuperAdmin(
    @Body() registerData: AuthRegisterSuperAdminDto,
    @Res() res: any,
  ) {
    try {
      this.logger.log(
        `Register superadmin with email: ${registerData.email}`,
        `POST /auth/registerSuperAdmin`,
      );
      const response: ResponseDto =
        await this.authClientService.registerSuperAdmin(registerData);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Failed to register superadmin with email: ${registerData.email}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to register superadmin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('registerResident')
  async registerResident(
    @Body() registerData: RegisterResidentDto,
    @Res() res: any,
  ) {
    try {
      this.logger.log(
        `Register resident with email: ${registerData.email}`,
        `POST /auth/registerResident`,
      );
      this.logger.debug(
        `Register resident data: ${JSON.stringify(registerData)}`,
      );

      const response: ResponseDto =
        await this.authClientService.registerResident(registerData);

      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(
        `Failed to register resident with email: ${registerData.email}`,
        error.stack,
      );

      throw new HttpException(
        'Error registering resident',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
