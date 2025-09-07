import { Injectable } from '@nestjs/common';
import { CreateRoomFinderDto } from './dto/create-room-finder.dto';
import { UpdateRoomFinderDto } from './dto/update-room-finder.dto';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class RoomFinderService {
  prisma = new PrismaClient()
  async create(createRoomFinderDto: CreateRoomFinderDto) {
    return this.prisma.roommate_finder.create({
      data: {
        ...createRoomFinderDto,
        move_in_date: createRoomFinderDto.move_in_date ? new Date(createRoomFinderDto.move_in_date) : undefined
      }
    });
  }


  private calculateMatchScore(roomFinder: any, post: any): number {
    let score = 0;
    let maxScore = 0;

    maxScore += 30;
    if (post.price <= roomFinder.budget) {
      score += 30;
    } else if (post.price <= roomFinder.budget * 1.1) {
      score += 15;
    }

    maxScore += 30;
    if (post.properties.address.includes(roomFinder.preferred_location)) {
      score += 30;
    }
    
    return Math.round((score / maxScore) * 100);
  }

  async findBestMatches(finderId: number, topN = 5) {
    const roomFinder = await this.prisma.roommate_finder.findUnique({
      where: { finder_id: finderId },
    });

    if (!roomFinder) {
      throw new Error('RoomFinder not found');
    }

    const posts = await this.prisma.posts.findMany({
      where: { status: 'active' },
      include: {
        properties: {
          include: {
            property_images: true,
          },
        },
      },
    });

    const matched = posts
      .map((post) => ({
        ...post,
        matchScore: this.calculateMatchScore(roomFinder, post),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, topN);

    return matched;
  }

  async findActiveRoomFinder(page: number, limit: number){
     const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.roommate_finder.findMany({
        where: { status: 'active' },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.roommate_finder.count({
        where: { status: 'active' },
      }),
    ]);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
