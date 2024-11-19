import { Types } from 'mongoose';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID del área común a reservar',
  })
  @IsMongoId()
  @IsNotEmpty({ message: 'El ID del área común es obligatorio' })
  id_common_area: Types.ObjectId;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID del anfitrión (residente que reserva el área común)',
  })
  @IsMongoId()
  @IsNotEmpty({ message: 'El ID del anfitrión es obligatorio' })
  id_host: Types.ObjectId;

  @ApiProperty({
    example: '2024-11-20T10:00:00.000Z',
    description: 'Fecha y hora de inicio de la reserva',
  })
  @IsDate()
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  start_time: Date;

  @ApiProperty({
    example: '2024-11-20T12:00:00.000Z',
    description: 'Fecha y hora de fin de la reserva',
  })
  @IsDate()
  @IsNotEmpty({ message: 'La fecha de fin es obligatoria' })
  end_time: Date;

  @ApiPropertyOptional({
    example: 'tenant-123',
    description: 'ID del inquilino asociado (opcional)',
  })
  @IsString()
  @IsOptional()
  tenantId?: string;
}
