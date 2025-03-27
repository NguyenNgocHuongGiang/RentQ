import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional } from "class-validator";

export enum RoleRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export class CreateRoleRequestDto {
  @ApiProperty({ example: 1, description: "User ID who is making the request" })
  @IsInt()
  user_id: number;

  @ApiProperty({
    example: RoleRequestStatus.PENDING,
    enum: RoleRequestStatus,
    description: "Status of the role request",
  })
  @IsEnum(RoleRequestStatus)
  @IsOptional() 
  status?: RoleRequestStatus;
}
