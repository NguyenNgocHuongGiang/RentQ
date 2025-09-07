import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsEnum } from "class-validator";

export enum RoomRequestStatus {
  OPEN = "open",
  CLOSED = "closed",
}

export class CreateRoomRequestDto {
  @ApiProperty({ example: 1, description: "Tenant ID" })
  @IsInt()
  tenant_id: number;

  @ApiProperty({ example: 10, description: "Property ID", required: false })
  @IsOptional()
  @IsInt()
  property_id: number;

  @ApiProperty({ example: "Cần tìm bạn cùng phòng ở Quận 7", description: "Request description" })
  @IsString()
  description: string;

  @ApiProperty({
    example: RoomRequestStatus.OPEN,
    enum: RoomRequestStatus,
    description: "Status of the request",
    required: false,
  })
  @IsOptional()
  @IsEnum(RoomRequestStatus)
  status?: RoomRequestStatus = RoomRequestStatus.OPEN;
}
