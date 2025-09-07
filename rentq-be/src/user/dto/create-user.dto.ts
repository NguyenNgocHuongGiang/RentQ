import {
  IsString,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { users_role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  full_name: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '1234567890',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Avatar URL of the user',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: users_role,
    default: users_role.tenant,
    required: false,
  })
  @IsEnum(users_role)
  @IsOptional()
  role?: users_role;

  @ApiProperty({
    description: 'Verification status of the user',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;
}

export class CreateBankAccountDto {
  // @ApiProperty({
  //   description: 'Unique ID of the bank account',
  //   example: 'acc_123456',
  // })
  // @IsString()
  // account_id?: number;

  @ApiProperty({
    description: 'ID of the user who owns the bank account',
    example: '123',
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Bank code', example: 'VCB' })
  @IsString()
  bank_code: string;

  @ApiProperty({ description: 'Name of the bank', example: 'Vietcombank' })
  @IsString()
  bank_name: string;

  @ApiProperty({ description: 'Bin of the bank', example: '970436' })
  @IsString()
  bank_bin: string;

  @ApiProperty({ description: 'Account number', example: '0123456789' })
  @IsString()
  account_number: string;

  @ApiProperty({ description: 'Account holder name', example: 'Nguyen Van A' })
  @IsString()
  account_holder: string;

  @ApiProperty({
    description: 'Branch of the bank',
    example: 'Vietcombank Ho Chi Minh',
    required: false,
  })
  @IsString()
  @IsOptional()
  branch?: string;

  // @ApiProperty({
  //   description: 'QR code URL for payment',
  //   example: 'https://example.com/qrcode.png',
  //   required: false,
  // })
  // @IsString()
  // @IsOptional()
  // qr_code_url?: string;

  @ApiProperty({
    description: 'Set as default bank account',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}
