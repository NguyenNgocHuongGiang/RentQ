import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum BillStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum BillItemType {
  RENT = 'RENT',
  SERVICE = 'SERVICE',
  ELECTRIC = 'ELECTRIC',
  WATER = 'WATER',
  INTERNET = 'INTERNET',
  OTHER = 'OTHER',
}

export class CreateBillItemDto {
  @ApiProperty({ enum: BillItemType, example: BillItemType.RENT })
  @IsEnum(BillItemType, { message: 'Item type must be a valid enum value' })
  item_type: BillItemType;

  @ApiProperty({ example: 'Tiền thuê tháng 8', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 5000000, description: 'Đơn giá' })
  @IsNumber()
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @ApiProperty({ example: 1200, required: false })
  @IsOptional()
  @IsNumber()
  start_number?: number;

  @ApiProperty({ example: 1300, required: false })
  @IsOptional()
  @IsNumber()
  end_number?: number;

  @ApiProperty({ example: 5000000, description: 'Thành tiền' })
  @IsNumber()
  @IsNotEmpty({ message: 'Total price is required' })
  total_price: number;

  @ApiProperty({ example: 'Chi phí khác', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateBillDto {
  @ApiProperty({ example: 12, description: 'Contract ID' })
  @IsNumber()
  @IsNotEmpty({ message: 'Contract ID is required' })
  contract_id: number;

  @ApiProperty({ example: '2025-08-01', description: 'Bill date (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'Bill date must be a valid date string' })
  bill_date: string;

  @ApiProperty({ example: '2025-08-10', description: 'Due date (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'Due date must be a valid date string' })
  due_date: string;

  @ApiProperty({ example: 5500000, description: 'Tổng tiền hóa đơn' })
  @IsNumber()
  @IsNotEmpty({ message: 'Total amount is required' })
  total_amount: number;

  @ApiProperty({ enum: BillStatus, example: BillStatus.UNPAID })
  @IsEnum(BillStatus)
  status: BillStatus;

  @ApiProperty({ example: '2025-08-10', description: 'Ngày thanh toán', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'Payment date must be a valid date string' })
  payment_date?: string;

  @ApiProperty({ type: [CreateBillItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateBillItemDto)
  @ArrayMinSize(1, { message: 'At least one item is required' })
  bill_items: CreateBillItemDto[];
}
