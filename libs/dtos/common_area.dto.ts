import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsIn,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommonAreaDto {
  @ApiProperty({
    example: 'Salon',
    description: 'Nombre del area comun',
  })
  @IsNotEmpty({ message: 'El nombre del area comun es obligatorio' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Este lugar existe',
    description: 'Descripcion del area comun',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Capacidad maxima de personas',
  })
  @IsNotEmpty({ message: 'la capacidad maxima es obligatoria' })
  @IsNumber({}, { message: 'La capacidad debe ser un número válido' })
  @Min(1, { message: 'La capacidad mínima debe ser 1' })
  capacity: number;

  @ApiPropertyOptional({
    example: 'tenant-123',
    description: 'ID del inquilino asociado al apartamento',
  })
  @IsString()
  @IsOptional()
  tenantId?: string;

  @ApiProperty({
    example: 'Disponible',
    description: 'Estado del área común (disponible o no disponible)',
    enum: ['Disponible', 'No Disponible'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['Disponible', 'No Disponible'], {
    message: 'El estado debe ser "disponible" o "no disponible"',
  })
  status: string;
}

export class GetByStatusDto {
  @ApiProperty({
    example: 'tenant-123',
    description: 'ID del tenant asociado al apartamento',
  })
  tenantId: string;
  @ApiProperty({
    example: 'Disponible',
    description: 'Estado del área común (disponible o no disponible)',
    enum: ['Disponible', 'No Disponible'],
  })
  @IsString()
  status: string;
}

export class GetByNameDto {
  @ApiProperty({
    example: 'tenant-123',
    description: 'ID del tenant asociado al apartamento',
  })
  tenantId: string;
  name: string;
}

export class DeleteCommonAreaDto {
  @ApiProperty({
    example: 'tenant-123',
    description: 'ID del tenant asociado al apartamento',
  })
  tenantId: string;
  id: string;
}

export class UpdateCommonAreaDto {
  @ApiProperty({
    example: 'tenant-123',
    description: 'ID del tenant asociado a la sala comun',
  })
  @IsString()
  tenantId: string;
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID de MongoDB de la sala commun',
  })
  @IsString()
  id: string;
  @ApiProperty({
    example: 'Salon',
    description: 'Nombre del area comun',
  })
  @IsString()
  name: string;
  @ApiPropertyOptional({
    example: 'Este lugar existe',
    description: 'Descripcion del area comun',
  })
  @IsOptional()
  @IsString()
  description: string;
  @ApiProperty({
    description: 'Capacidad maxima de personas',
  })
  @IsNotEmpty({ message: 'la capacidad maxima es obligatoria' })
  @IsNumber({}, { message: 'La capacidad debe ser un número válido' })
  @Min(1, { message: 'La capacidad mínima debe ser 1' })
  capacity: number;
  @ApiProperty({
    example: 'Disponible',
    description: 'Estado del área común (disponible o no disponible)',
    enum: ['Disponible', 'No Disponible'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['Disponible', 'No Disponible'], {
    message: 'El estado debe ser "disponible" o "no disponible"',
  })
  status: string;
}
