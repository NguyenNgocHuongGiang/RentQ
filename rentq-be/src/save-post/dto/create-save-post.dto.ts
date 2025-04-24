import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSavePostDto {
  @ApiProperty({ example: 1, description: "User's ID" })
  @IsNumber()
  @IsNotEmpty({ message: 'User ID is required' })
  user_id: number;

  @ApiProperty({ example: 1, description: "Post's ID" })
  @IsNumber()
  @IsNotEmpty({ message: 'Post ID is required' })
  post_id: number;
}
