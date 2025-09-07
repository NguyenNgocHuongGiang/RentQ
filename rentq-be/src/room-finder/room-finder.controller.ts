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
import { RoomFinderService } from './room-finder.service';
import { CreateRoomFinderDto } from './dto/create-room-finder.dto';
import { UpdateRoomFinderDto } from './dto/update-room-finder.dto';
import { AutoApiResponse } from 'src/auto-api-response.decorator';

@Controller('room-finder')
export class RoomFinderController {
  constructor(private readonly roomFinderService: RoomFinderService) {}

  @Post()
  @AutoApiResponse('POST')
  create(@Body() createRoomFinderDto: CreateRoomFinderDto) {
    return this.roomFinderService.create(createRoomFinderDto);
  }

  @Get('matched/:finderId')
  @AutoApiResponse('GET')
  async getBestMatches(
    @Param('finderId') finderId: number,
    @Query('topN') topN?: string,
  ) {
    const top = topN ? parseInt(topN, 10) : 5;
    return this.roomFinderService.findBestMatches(+finderId, top);
  }

  @Get('active')
  @AutoApiResponse('GET')
  async findAllActive(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.roomFinderService.findActiveRoomFinder(+page, +limit);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roomFinderService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoomFinderDto: UpdateRoomFinderDto) {
  //   return this.roomFinderService.update(+id, updateRoomFinderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roomFinderService.remove(+id);
  // }
}
