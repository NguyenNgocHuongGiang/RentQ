import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ReviewsService {
  prisma = new PrismaClient()

  async create(createReviewDto: CreateReviewDto) {
    const listings = await this.prisma.listings.findFirst({
      where: {
        listing_id: createReviewDto.listing_id
      }
    });
    const host = listings?.landlord_id;
    if (createReviewDto.tenant_id === host) {
      throw new BadRequestException("You cannot review your own listing.");
    }
    return this.prisma.reviews.create({
      data: createReviewDto
    })
  }

  // findAll() {
  //   return `This action returns all reviews`;
  // }

  async findListingReview(id: number) {
    return this.prisma.reviews.findMany({
      where: {
        listing_id: id
      }
    });
  }

  // update(id: number, updateReviewDto: UpdateReviewDto) {
  //   return `This action updates a #${id} review`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} review`;
  // }
}
