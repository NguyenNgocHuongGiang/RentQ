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

  async findActivePosts() {
    return await this.prisma.posts.findMany({
      where: {
        status: 'active',
        is_approved: true,
      },
      select:{
        price: true,
        alias: true,
        properties: {
          select: {
            address: true,
            area: true,
            reviews: true,
            property_images: true,
          },
        },
      }
    });
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

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
