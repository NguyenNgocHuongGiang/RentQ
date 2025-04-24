import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePropertyImageListDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  property_id: number;

  @IsNotEmpty()
  @ApiProperty({ type: 'array', items: { type: 'string' } })
  images_url_list: string[];

  @IsNotEmpty()
  @ApiProperty({ type: 'array', items: { type: 'boolean' } })
  is_main_list: boolean[];
}


export class CreatePropertyImageDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 1, })
  property_id: number;

  @IsNotEmpty()
  @ApiProperty({ type: 'string' })
  images_url: string;

  @IsArray()
  @ApiProperty({type : 'boolean'})
  is_main: boolean;
}