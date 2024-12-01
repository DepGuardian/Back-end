import { Types } from 'mongoose';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class TodoDto {
  @ApiProperty({
    example: 'Comprar víveres',
    description: 'Título de la tarea',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Estado de completado de la tarea',
  })
  @IsBoolean()
  @IsOptional()
  done?: boolean;

  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439011',
    description: 'ID de MongoDB de la tarea',
  })
  @IsOptional()
  @IsMongoId()
  id?: Types.ObjectId;
}

export class CreateTodoDto {
  @ApiProperty({ example: 'tenant-123', description: 'ID del inquilino' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ description: 'Datos de la tarea', type: TodoDto })
  @IsNotEmpty()
  data: TodoDto;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID de MongoDB del residente',
  })
  @IsString()
  residentId: string;
}

export class DeleteTodoDto {
  @ApiProperty({ example: 'tenant-123', description: 'ID del inquilino' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID de MongoDB de la tarea',
  })
  @IsMongoId()
  todoId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID de MongoDB del residente',
  })
  @IsMongoId()
  residentId: string;
}

export class GetAllTodosDto {
  @ApiProperty({ example: 'tenant-123', description: 'ID del inquilino' })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID de MongoDB del residente',
  })
  @IsMongoId()
  @Transform(({ value }) => Types.ObjectId.createFromHexString(value))
  residentId: Types.ObjectId;
}
