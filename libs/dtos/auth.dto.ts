import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'MiContraseña123!',
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: false,
    description: 'Indica si el usuario es super administrador',
  })
  @IsBoolean()
  isSuperAdmin: boolean;

  @ApiPropertyOptional({
    example: 'tenant-123',
    description: 'ID del inquilino (requerido para usuarios no super admin)',
  })
  @IsString()
  @IsOptional()
  tenantId?: string;
}

export class AuthRegisterSuperAdminDto {
  @ApiProperty({
    example: 'admin@ejemplo.com',
    description: 'Correo electrónico del super administrador',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SuperAdmin123!',
    description: 'Contraseña del super administrador (mínimo 8 caracteres)',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'tenant-123',
    description: 'ID del inquilino al que pertenecerá el super administrador',
  })
  @IsString()
  @IsNotEmpty({ message: 'El tenantId es requerido' })
  tenantId: string;
}
