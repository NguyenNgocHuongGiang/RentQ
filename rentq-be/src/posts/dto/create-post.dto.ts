import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsString, IsDate } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ example: 1, description: "Property's ID" })
    @IsNumber()
    @IsNotEmpty({ message: "Landlord ID is required" })
    property_id: number;


    @ApiProperty({ example: "Luxury Apartment", description: "Post title" })
    @IsString()
    @IsNotEmpty({ message: "Title is required" })
    title: string;

    @ApiProperty({ example: "luxury-apartment", description: "Listing alias" })
    @IsString()
    @IsOptional()
    alias: string;

    @ApiProperty({ example: 15000000, description: "Price (VND)", type: Number })
    @IsNumber() 
    @IsNotEmpty({ message: "Price is required" })
    price: number;

    @ApiProperty({ example: "Beautiful apartment, close to downtown", required: false, description: "Description" })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'active', description: "Status" })
    @IsNotEmpty({ message: "Status is required" })
    status: boolean;

    @ApiProperty({ example: false, description: "Is approval" })
    @IsEnum({ true: true, false: false })
    @IsNotEmpty({ message: "Is approval is required" })
    is_approved: boolean;
}