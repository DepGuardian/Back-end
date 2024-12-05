import { Types } from 'mongoose';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateApartmentDto {
  @ApiProperty({
    example: '674ce9dd4243c0444ebd84c6',
    description: 'Nombre del propietario del apartamento',
  })
  @IsString()
  @IsOptional()
  owner: string;

  @ApiProperty({
    example: 5,
    description: 'Número del piso donde se encuentra el apartamento',
  })
  @IsNumber()
  @Min(0, { message: 'El número del piso debe ser mayor o igual a 0' })
  floor: number;

  @ApiProperty({
    example: 'A-501',
    description: 'Identificador o número del apartamento',
  })
  @IsString()
  @IsNotEmpty({ message: 'El número de apartamento es requerido' })
  apartment: string;

  @ApiPropertyOptional({
    example: 'tenant-123',
    description: 'ID del inquilino asociado al apartamento',
  })
  @IsString()
  @IsOptional()
  tenantId?: string;
}

export class RefreshCodeDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID de MongoDB del apartamento',
  })
  @IsString()
  @IsNotEmpty({ message: 'El ID del apartamento es requerido' })
  apartmentId: string;

  @ApiProperty({
    example: 'tenant-123',
    description: 'ID del inquilino',
  })
  @IsString()
  @IsNotEmpty({ message: 'El tenantId es requerido' })
  tenantId: string;
}
