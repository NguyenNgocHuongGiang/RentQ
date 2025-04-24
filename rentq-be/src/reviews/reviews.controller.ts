import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutoApiResponse } from 'src/auto-api-response.decorator';

@Controller('reviews')
@ApiTags('Reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @AutoApiResponse('POST')
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  // @Get()
  // findAll() {
  //   return this.reviewsService.findAll();
  // }

  @Get(':propertyId')
  @AutoApiResponse('GET')
  findListingReview(@Param('propertyId') id: string) {
    return this.reviewsService.findPropertyReview(+id);
  }

  @Patch(':id')
  @AutoApiResponse('PATCH')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  @AutoApiResponse('DELETE')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
