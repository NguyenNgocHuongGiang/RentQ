import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsString, IsDate } from "class-validator";
import { Type } from "class-transformer";  

export class CreateListingDto {
    @ApiProperty({ example: 1, description: "Landlord's ID" })
    @IsNumber()
    @IsNotEmpty({ message: "Landlord ID is required" })
    landlordId: number;

    @ApiProperty({ example: "Luxury Apartment", description: "Listing title" })
    @IsString()
    @IsNotEmpty({ message: "Title is required" })
    title: string;

    @ApiProperty({ example: "123 ABC Street, District 1", description: "Listing address" })
    @IsString()
    @IsNotEmpty({ message: "Address is required" })
    address: string;

    @ApiProperty({ example: 50, description: "Area (m²)" })
    @IsNumber()
    @IsNotEmpty({ message: "Area is required" })
    area: number;

    @ApiProperty({ example: "15000000", description: "Price (VND)", type: String }) // Prisma uses Decimal
    @IsNumber() 
    @IsNotEmpty({ message: "Price is required" })
    price: number;

    @ApiProperty({ example: "Free electricity, water, internet", required: false, description: "Additional utilities" })
    @IsString()
    @IsOptional()
    utilities?: string;

    @ApiProperty({ example: 3, description: "Maximum number of occupants" })
    @IsNumber()
    @IsNotEmpty({ message: "Max people is required" })
    maxPeople: number;

    @ApiProperty({ enum: ['full', 'basic', 'none'], example: 'full', description: "Furniture type" })
    @IsEnum(['full', 'basic', 'none'], { message: "Furniture must be 'full', 'basic', or 'none'" })
    @IsNotEmpty({ message: "Furniture is required" })
    furniture: 'full' | 'basic' | 'none';

    @ApiProperty({ type: Date, example: "2024-08-01T00:00:00.000Z", description: "Available move-in date" })
    @IsDate()
    @Type(() => Date)  
    @IsNotEmpty({ message: "Available from date is required" })
    availableFrom: Date;

    @ApiProperty({ enum: ['apartment', 'house', 'office', 'storefront'], example: 'apartment', description: "Property type" })
    @IsEnum(['apartment', 'house', 'office', 'storefront'], { message: "Invalid property type" })
    propertyType?: 'apartment' | 'house' | 'office' | 'storefront';

    @ApiProperty({ example: "Beautiful apartment, close to downtown", required: false, description: "Description" })
    @IsString()
    @IsOptional()
    description?: string;
}
