import { Types } from 'mongoose';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsIn,
  IsMongoId,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCommonAreaDto {
  @ApiProperty({
    example: 'Salon',
    description: 'Nombre del area comun',
  })
  @IsNotEmpty({message: 'El nombre del area comun es obligatorio'})
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
    description: 'Capacidad maxima de personas'
  })
  @IsNotEmpty({message: 'la capacidad maxima es obligatoria'})
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
  @IsNotEmpty()
  @IsIn(['Disponible', 'No Disponible'], {
    message: 'El estado debe ser "disponible" o "no disponible"',
  })
  status: string;
}