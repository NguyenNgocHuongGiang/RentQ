import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('reviews')
@ApiTags('Reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Created successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Error' })
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  // @Get()
  // findAll() {
  //   return this.reviewsService.findAll();
  // }

  @Get(':listingId')
  @ApiResponse({
    status: 200,
    description: 'Get successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Error' })
  findListingReview(@Param('listingId') id: string) {
    return this.reviewsService.findListingReview(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
  //   return this.reviewsService.update(+id, updateReviewDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reviewsService.remove(+id);
  // }
}
