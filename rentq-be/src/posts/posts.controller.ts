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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AutoApiResponse } from 'src/auto-api-response.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @AutoApiResponse('POST')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get('active')
  @AutoApiResponse('GET')
  findActivePosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
  ) {
    return this.postsService.findActivePosts(+page, +limit);
  }

  @Get('/detail-post/:alias')
  @AutoApiResponse('GET')
  findDetailPosts(@Param('alias') alias: string) {
    return this.postsService.findDetailPosts(alias);
  }

  // @Get()
  // findAll() {
  //   return this.postsService.findAll();
  // }

  @Get('/get-user-posts/:userId')
  @AutoApiResponse('GET')
  findOne(@Param('userId') id: string) {
    return this.postsService.findOne(+id);
  }

  @Get(':location/:available')
  @AutoApiResponse('GET')
  async findPosts(
    @Param('location') location: string = '',
    @Param('available') available: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 5,
  ) {
    return this.postsService.findPostByLocation(
      location,
      available,
      +page,
      +size,
    );
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(+id, updatePostDto);
  // }

  @Delete(':id')
  @AutoApiResponse('DELETE')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
