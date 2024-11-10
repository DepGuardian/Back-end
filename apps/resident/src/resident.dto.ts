import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterResidentDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'resident@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'A-101' })
  @IsString()
  @IsNotEmpty()
  apartment: string;

  @ApiProperty({ example: 'tenant-123' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;
}