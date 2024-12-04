import { IsEmail, IsString, MinLength, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterResidentDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'resident@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ss123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'A-101' })
  @IsString()
  @IsNotEmpty()
  apartment: string;

  @ApiProperty({ example: 'tenant-123' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ example: 123456 })
  @IsNumber()
  @IsNotEmpty()
  code: number;
}
