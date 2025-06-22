import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateContractTenantDto {
  @ApiProperty({ example: 1, description: "Contract'id" })
  @IsNumber()
  @IsNotEmpty({ message: "Contract ID is required" })
  contract_id: number;

  @ApiProperty({ example: ['abc@gmail.com', 'def@gmail.com'], description: "Tenant's email" })
  @IsNotEmpty({ message: "Tenant's email is required" })
  emailList: string[];
}

// export class CreateTenantDto {
//   @ApiProperty({ example: 1, description: "Tenant's email" })
//   @IsEmail()
//   @IsNotEmpty({ message: "Tenant's email is required" })
//   email: string;
// }
