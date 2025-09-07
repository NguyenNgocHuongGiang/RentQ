import { Injectable } from '@nestjs/common';
import { CreateRoomRequestDto } from './dto/create-room-request.dto';
import { UpdateRoomRequestDto } from './dto/update-room-request.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RoomRequestService {
  prisma = new PrismaClient();
  async create(createRoomRequestDto: CreateRoomRequestDto) {
    const dataCreate = await this.prisma.roommate_requests.create({
      data: createRoomRequestDto,
      include: {
        properties: {
          include: {
            property_images: true,
            posts: {
              where: { status: 'active' },
              orderBy: { created_at: 'desc' },
              take: 1,
            },
          },
        },
        users: true,
      },
    });
    return dataCreate;
  }

  async findAllActive(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.roommate_requests.findMany({
        where: { status: 'open' },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          users: true,
          properties: {
            include: {
              property_images: true,
              posts: {
                where: { status: 'active' },
                orderBy: { created_at: 'desc' },
                take: 1,
              },
            },
          },
        },
      }),
      this.prisma.roommate_requests.count({
        where: { status: 'open' },
      }),
    ]);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} roomRequest`;
  // }

  // update(id: number, updateRoomRequestDto: UpdateRoomRequestDto) {
  //   return `This action updates a #${id} roomRequest`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} roomRequest`;
  // }
}
