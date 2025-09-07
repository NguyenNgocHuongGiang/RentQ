import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoomRequestService } from './room-request.service';
import { CreateRoomRequestDto } from './dto/create-room-request.dto';
import { UpdateRoomRequestDto } from './dto/update-room-request.dto';
import { AutoApiResponse } from 'src/auto-api-response.decorator';

@Controller('roommate-request')
export class RoomRequestController {
  constructor(private readonly roomRequestService: RoomRequestService) {}

  @Post()
  @AutoApiResponse('POST')
  create(@Body() createRoomRequestDto: CreateRoomRequestDto) {
    return this.roomRequestService.create(createRoomRequestDto);
  }

  @Get('active')
  @AutoApiResponse('GET')
  findAllActive(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.roomRequestService.findAllActive(+page, +limit);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roomRequestService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoomRequestDto: UpdateRoomRequestDto) {
  //   return this.roomRequestService.update(+id, updateRoomRequestDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roomRequestService.remove(+id);
  // }
}
