import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsString, IsDate } from "class-validator";
import { Type } from "class-transformer";  

export class CreateReviewDto {
    @ApiProperty({ example: 1, description: "Property's ID" })
    @IsNumber()
    @IsNotEmpty({ message: "Property ID is required" })
    property_id: number;

    @ApiProperty({ example: 1, description: "Tenant's ID" })
    @IsNumber()
    @IsNotEmpty({ message: "Tenant ID is required" })
    tenant_id: number;

    @ApiProperty({ example: 5 })
    @IsNumber()
    @IsNotEmpty({ message: "Rating is required" })
    rating: number;

    @ApiProperty({ example: "string" })
    @IsString()
    @IsNotEmpty({ message: "Comment is required" })
    comment: string;
}