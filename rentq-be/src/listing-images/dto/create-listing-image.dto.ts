import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class CreateListingImageInputDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ example: 1, })
    listing_id: number;

    @IsNotEmpty()
    @ApiProperty({ type: 'array', items: { type: 'string' } })
    images_url: string[];
  
    @IsNotEmpty()
    @ApiProperty({ type: 'array', items: { type: 'boolean' } })
    isMain: boolean[];
}

export class CreateListingImageDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ example: 1, })
    listing_id: number;

    @IsNotEmpty()
    @ApiProperty({ type: 'string' })
    images_url: string;
  
    @IsArray()
    @ApiProperty({type : 'boolean'})
    isMain: boolean;
}
