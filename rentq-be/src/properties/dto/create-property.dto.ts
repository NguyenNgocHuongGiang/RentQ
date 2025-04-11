import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsString, IsDate } from "class-validator";
import { Type } from "class-transformer";  

export class CreatePropertyDto {
    @ApiProperty({ example: 1, description: "Landlord's ID" })
    @IsNumber()
    @IsNotEmpty({ message: "Landlord ID is required" })
    landlord_id: number;

    @ApiProperty({ example: "123 ABC Street, District 1", description: "Listing address" })
    @IsString()
    @IsNotEmpty({ message: "Address is required" })
    address: string;

    @ApiProperty({ example: 50, description: "Area (m²)" })
    @IsNumber()
    @IsNotEmpty({ message: "Area is required" })
    area: number;

    @ApiProperty({ example: "Free electricity, water, internet", required: false, description: "Additional utilities" })
    @IsString()
    @IsOptional()
    utilities?: string;

    @ApiProperty({ example: 3, description: "Maximum number of occupants" })
    @IsNumber()
    @IsNotEmpty({ message: "Max people is required" })
    max_people: number;

    @ApiProperty({ enum: ['full', 'basic', 'none'], example: 'full', description: "Furniture type" })
    @IsEnum(['full', 'basic', 'none'], { message: "Furniture must be 'full', 'basic', or 'none'" })
    @IsNotEmpty({ message: "Furniture is required" })
    furniture: 'full' | 'basic' | 'none';

    @ApiProperty({ type: Date, example: "2024-08-01T00:00:00.000Z", description: "Available move-in date" })
    @IsDate()
    @Type(() => Date)  
    @IsNotEmpty({ message: "Available from date is required" })
    available_from: Date;

    @ApiProperty({ enum: ['apartment', 'house', 'office', 'storefront'], example: 'apartment', description: "Property type" })
    @IsEnum(['apartment', 'house', 'office', 'storefront'], { message: "Invalid property type" })
    property_type?: 'apartment' | 'house' | 'office' | 'storefront';

    @ApiProperty({ example: "Beautiful apartment, close to downtown", required: false, description: "Description" })
    @IsString()
    @IsOptional()
    description?: string;
}
