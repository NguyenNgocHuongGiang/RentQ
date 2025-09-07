import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PostsService {
  prisma = new PrismaClient();

  async create(createPostDto: CreatePostDto) {
    const { property_id } = createPostDto;
    const property = await this.prisma.properties.findUnique({
      where: { property_id },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return this.prisma.posts.create({
      data: {
        ...createPostDto,
        status: createPostDto.status ? 'active' : 'inactive',
      },
    });
  }

  async findActivePosts(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.posts.findMany({
        where: {
          status: 'active',
          is_approved: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take: limit,
        select: {
          post_id: true,
          price: true,
          alias: true,
          description: true,
          properties: {
            select: {
              max_people: true,
              address: true,
              area: true,
              property_images: true,
            },
          },
        },
      }),
      this.prisma.posts.count({
        where: {
          status: 'active',
          is_approved: true,
        },
      }),
    ]);

    return {
      posts,
      total,
    };
  }

  async findDetailPosts(alias: string) {
    return this.prisma.posts.findFirst({
      where: {
        alias: alias,
      },
      include: {
        properties: {
          include: {
            property_images: true,
          },
        },
      },
    });
  }

  async findPostByLocation(
    location: string,
    available: string,
    page: number,
    size: number,
  ) {
    let availableDay: Date | null = null;
    let endDate: Date | null = null;

    if (available && available !== 'noDate') {
      availableDay = new Date(available);
      endDate = new Date(availableDay);
      endDate.setDate(availableDay.getDate() + 2);
    }

    const whereConditions: any = {
      properties: {},
    };

    if (location && location !== 'noLocation') {
      whereConditions.properties.address = {
        contains: location,
      };
    }

    if (availableDay && endDate) {
      whereConditions.properties.available_from = {
        lte: endDate,
      };
    }

    const posts = await this.prisma.posts.findMany({
      where: whereConditions,
      include: {
        properties: {
          include: {
            property_images: true,
          },
        },
      },
      skip: (page - 1) * size,
      take: size,
    });

    const total = await this.prisma.posts.count({
      where: whereConditions,
    });

    return {
      posts,
      total,
    };
  }

  // async findAll() {
  //   return `This action returns all posts`;
  // }

  async findOne(id: number) {
    return this.prisma.posts.findMany({
      where: {
        properties: {
          landlord_id: id,
        },
      },
    });
  }

  // async update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  async remove(id: number) {
    const post = await this.prisma.posts.findUnique({
      where: { post_id: id },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return await this.prisma.posts.delete({
      where: { post_id: id },
    });
  }
}
