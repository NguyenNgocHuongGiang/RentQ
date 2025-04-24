import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiTags } from '@nestjs/swagger';
import { AutoApiResponse } from 'src/auto-api-response.decorator';

@Controller('message')
@ApiTags('Message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @AutoApiResponse('POST')
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get(':userId')
  @AutoApiResponse('GET')
  findPeople(@Param('userId') userId: string) {
    return this.messageService.findPeople(+userId);
  }

  @Get(':senderId/:receiverId')
  @AutoApiResponse('GET')
  findOne(@Param('senderId') senderId: string, @Param('receiverId') receiverId: string) {
    return this.messageService.findConversation(+senderId, +receiverId); // Chuyển đổi sang số nếu cần
  }
  

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
  //   return this.messageService.update(+id, updateMessageDto);
  // }

  @Delete(':senderId/:receiverId')
  remove(@Param('senderId') senderId: string, @Param('receiverId') receiverId: string) {
    return this.messageService.remove(+senderId, +receiverId);
  }
}
