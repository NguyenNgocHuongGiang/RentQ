import { Injectable } from '@nestjs/common';
import { CreateSavePostDto } from './dto/create-save-post.dto';
import { UpdateSavePostDto } from './dto/update-save-post.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SavePostService {
  prisma = new PrismaClient();
  
  create(createSavePostDto: CreateSavePostDto) {
    return this.prisma.save_posts.create({
      data: createSavePostDto,
    });
  }

  findUserSavePost(userId: number) {
    return this.prisma.save_posts.findMany({
      where: { user_id: userId },
      include: {
        posts: {
          include: {
            properties: {
              include: {
                property_images: true,
              },
            }
          },
        },
      },

    });
  }

  remove(userId: number, postId: number) {
    return this.prisma.save_posts.delete({
      where: {
        user_id_post_id: { user_id: userId, post_id: postId },
      },
    });
  }
}
