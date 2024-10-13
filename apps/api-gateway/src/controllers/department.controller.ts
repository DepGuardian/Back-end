import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError } from 'rxjs';
import { CreateDepartmentDto } from '../interfaces/department.interface';

@Controller('department')
export class DepartmentController {
  constructor(
    @Inject('DEPARTMENT_SERVICE')
    private readonly departmentService: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService
      .send({ cmd: 'create_department' }, createDepartmentDto)
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
  async findAll() {
    return this.departmentService.send({ cmd: 'get_departments' }, {}).pipe(
      timeout(5000),
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.departmentService.send({ cmd: 'get_department' }, { id }).pipe(
      timeout(5000),
      catchError((error) => {
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
}
