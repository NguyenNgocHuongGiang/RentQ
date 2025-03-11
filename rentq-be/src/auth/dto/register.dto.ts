import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: "User's fullname" })
  @IsString()
  full_name: string;

  @ApiProperty({ description: "User's email" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User's password" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: "User's phone number" })
  @IsString()
  phone: string

  @ApiProperty({ description: "User's address" })
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiProperty()
  @IsString()
  role: string

  @ApiProperty()
  @IsBoolean()
  is_verified: boolean
}
