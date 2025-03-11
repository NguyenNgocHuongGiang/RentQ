import { IsString, IsEmail, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { users_role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  full_name: string;

  @ApiProperty({ description: 'Phone number of the user', example: '1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Email address of the user', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Address of the user', example: '123 Main St', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Avatar URL of the user', example: 'https://example.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({ description: 'Role of the user', enum: users_role, default: users_role.tenant, required: false })
  @IsEnum(users_role)
  @IsOptional()
  role?: users_role;

  @ApiProperty({ description: 'Verification status of the user', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;
}