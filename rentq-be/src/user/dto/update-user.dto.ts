import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe', required: false })
  full_name?: string;

  @ApiProperty({ description: 'Phone number of the user', example: '1234567890', required: false })
  phone?: string;

  @ApiProperty({ description: 'Email address of the user', example: 'john@example.com', required: false })
  email?: string;

  @ApiProperty({ description: 'Password of the user', example: 'password123', required: false })
  password?: string;

  @ApiProperty({ description: 'Address of the user', example: '123 Main St', required: false })
  address?: string;

  @ApiProperty({ description: 'Avatar URL of the user', example: 'https://example.com/avatar.jpg', required: false })
  avatar_url?: string;

  @ApiProperty({ description: 'Role of the user', enum: ['admin', 'landlord', 'tenant'], required: false })
  role?: 'admin' | 'landlord' | 'tenant';

  @ApiProperty({ description: 'Verification status of the user', example: false, required: false })
  is_verified?: boolean;
}