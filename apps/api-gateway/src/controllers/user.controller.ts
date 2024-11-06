import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError } from 'rxjs';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: any,
    @Headers('tenant-id') tenantId: string,
  ) {
    return this.userService
      .send({ cmd: 'create_user' }, { ...createUserDto, tenantId })
      .pipe(
        timeout(5000), // 5 segundos de timeout
        catchError((error: any) => {
          if (error instanceof TimeoutError) {
            throw new HttpException(
              'Request timeout',
              HttpStatus.GATEWAY_TIMEOUT,
            );
          }

          const { message, statusCode } = error as {
            message?: string;
            statusCode?: number;
          };

          throw new HttpException(
            {
              error: message ?? 'Unknown error',
              status: statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
            },
            statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
          );

        }),
      );
  }

  @Get()
  async findAll(@Headers('tenant-id') tenantId: string) {
    return this.userService.send({ cmd: 'get_users' }, { tenantId }).pipe(
      timeout(5000),
      catchError((error) => {
        if (error instanceof TimeoutError) {
          throw new HttpException(
            'Request timeout',
            HttpStatus.GATEWAY_TIMEOUT,
          );
        }
        throw new HttpException(
          'An error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('tenant-id') tenantId: string,
  ) {
    return this.userService.send({ cmd: 'get_user' }, { id, tenantId }).pipe(
      timeout(5000),
      catchError((error) => {
        if (error instanceof TimeoutError) {
          throw new HttpException(
            'Request timeout',
            HttpStatus.GATEWAY_TIMEOUT,
          );
        }
        throw new HttpException(
          'An error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}