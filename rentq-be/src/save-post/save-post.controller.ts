import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SavePostService } from './save-post.service';
import { CreateSavePostDto } from './dto/create-save-post.dto';
import { AutoApiResponse } from 'src/auto-api-response.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('save-post')
@ApiTags('SavePost')
export class SavePostController {
  constructor(private readonly savePostService: SavePostService) {}

  @Post()
  @AutoApiResponse('POST')
  create(@Body() createSavePostDto: CreateSavePostDto) {
    return this.savePostService.create(createSavePostDto);
  }

  @Get(':userId')
  @AutoApiResponse('GET')
  findOne(@Param('userId') user_id: string) {
    return this.savePostService.findUserSavePost(+user_id);
  }

  @Delete(':userId/:postId')
  @AutoApiResponse('DELETE')
  remove(@Param('userId') userId: string, @Param('postId') postId: string) {
    return this.savePostService.remove(+userId, +postId);
  }
}
