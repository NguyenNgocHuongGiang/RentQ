import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsNumber, IsEnum, IsDateString } from "class-validator";

export enum RoomFinderStatus {
  ACTIVE = "active",
  MATCHED = "matched",
  CLOSED = "closed",
}

export class CreateRoomFinderDto {
  @ApiProperty({ example: 1, description: "Tenant ID" })
  @IsInt()
  tenant_id: number;

  @ApiProperty({ example: "Quận 7, gần TDTU", description: "Preferred location" })
  @IsString()
  preferred_location: string;

  @ApiProperty({ example: 3000000, description: "Budget in VND", required: false })
  @IsOptional()
  @IsNumber()
  budget: number;

  @ApiProperty({ example: "2025-09-15", description: "Move in date", required: false })
  @IsOptional()
  @IsDateString()
  move_in_date?: string;

  @ApiProperty({ example: "roommate_2;parking;pet", description: "Preferences as string separated by ;", required: false })
  @IsOptional()
  @IsString()
  preferences?: string;

  @ApiProperty({ example: RoomFinderStatus.ACTIVE, enum: RoomFinderStatus, description: "Status of the room finder", required: false })
  @IsOptional()
  @IsEnum(RoomFinderStatus)
  status?: RoomFinderStatus;
}
