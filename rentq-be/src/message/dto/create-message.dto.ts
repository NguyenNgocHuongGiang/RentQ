import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 1, description: "Sender's ID" })
  @IsNumber()
  @IsNotEmpty({ message: 'Sender ID is required' })
  sender_id: number;

  @ApiProperty({ example: 1, description: "Receiver's ID" })
  @IsNumber()
  @IsNotEmpty({ message: 'Receiver ID is required' })
  receiver_id: number;

  @ApiProperty({ example: 'Hello fen', description: "Message's content" })
  @IsString()
  @IsNotEmpty({ message: 'Hello fen' })
  content: string;
}
