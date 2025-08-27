import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
} from 'class-validator';

export enum ContractStatus {
  ACTIVE = 'active',
  TERMINATED = 'terminated',
  PENDING = 'pending',
}

export class CreateContractDto {
  @ApiProperty({ example: 1, description: "Property's ID" })
  @IsNumber()
  @IsNotEmpty({ message: 'Property ID is required' })
  property_id: number;

  @ApiProperty({ example: 2, description: "Landlord's ID" })
  @IsNumber()
  @IsNotEmpty({ message: 'Landlord ID is required' })
  landlord_id: number;

  @ApiProperty({ example: '2025-02-21T00:00:00.000Z', description: 'Start date of contract (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'Start date must be a valid date string' })
  @IsNotEmpty({ message: 'Start date is required' })
  start_date: string;

  @ApiProperty({ example: '2026-02-21T00:00:00.000Z', description: 'End date of contract (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'End date must be a valid date string' })
  @IsNotEmpty({ message: 'End date is required' })
  end_date: string;

  @ApiProperty({ example: '2025-02-22T00:00:00.000Z', description: 'Actual move-in date (YYYY-MM-DD)', required: false })
  @IsDateString({}, { message: 'Actual move-in date must be a valid date string' })
  @IsOptional()
  actual_move_in_date?: string;

  @ApiProperty({ example: 5000000.00, description: 'Deposit amount (VND)' })
  @IsNotEmpty({ message: 'Deposit is required' })
  deposit: number;

  @ApiProperty({ example: 15000000.00, description: 'Monthly rent (VND)' })
  @IsNotEmpty({ message: 'Rent is required' })
  rent: number;

  @ApiProperty({ example: ContractStatus.PENDING, enum: ContractStatus, description: 'Contract status' })
  @IsEnum(ContractStatus, { message: 'Status must be one of active, terminated, pending' })
  @IsNotEmpty({ message: 'Status is required' })
  status: ContractStatus;

  @ApiProperty({ example: 'https://example.com/contracts/contract_123.pdf', description: 'URL to contract PDF', required: false })
  @IsString()
  @IsOptional()
  contract_file_url?: string;

  @ApiProperty({ example: 'Terms and conditions content here...', description: 'Terms and conditions', required: false })
  @IsString()
  @IsOptional()
  terms_and_conditions?: string;
}
