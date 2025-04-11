import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ReviewsService {
  prisma = new PrismaClient();

  async create(createReviewDto: CreateReviewDto) {
    const property = await this.prisma.properties.findFirst({
      where: {
        property_id: createReviewDto.property_id,
      },
    });
    const host = property?.landlord_id;
    if (createReviewDto.tenant_id === host) {
      throw new BadRequestException('You cannot review your own listing.');
    }
    return this.prisma.reviews.create({
      data: createReviewDto,
    });
  }

  // findAll() {
  //   return `This action returns all reviews`;
  // }

  async findPropertyReview(id: number) {
    return this.prisma.reviews.findMany({
      where: {
        property_id: id,
      },
      select: {
        comment: true,
        rating: true,
        created_at: true,
        users: {
          select: {
            full_name: true,
            avatar_url: true,
          },
        },
      },
    });
  }

  // update(id: number, updateReviewDto: UpdateReviewDto) {
  //   return `This action updates a #${id} review`;
  // }

  async remove(id: number) {
    return this.prisma.reviews.delete({
      where: {
        review_id: id,
      },
    });
  }
}
