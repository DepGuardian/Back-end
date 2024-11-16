import { HttpStatus } from '@nestjs/common';
import { TypeErrors } from '../constants/errors';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
  })
  status: HttpStatus;

  @ApiProperty({
    description: 'Response message',
  })
  data: any;

  @ApiProperty({
    description: 'Error message',
  })
  errorMessage: TypeErrors;
}
