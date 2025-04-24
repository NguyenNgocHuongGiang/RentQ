import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaClient } from '@prisma/client';
import { log } from 'console';

@Injectable()
export class MessageService {
  prisma = new PrismaClient();
  create(createMessageDto: CreateMessageDto) {
    return this.prisma.messages.create({
      data: {
        sender_id: createMessageDto.sender_id,
        receiver_id: createMessageDto.receiver_id,
        content: createMessageDto.content,
      },
    });
  }

  // findAll() {
  //   return `This action returns all message`;
  // }

  async findPeople(senderId: number) {
    const messages = await this.prisma.messages.findMany({
      where: {
        OR: [{ sender_id: senderId }, { receiver_id: senderId }],
      },
      select: {
        sender_id: true,
        receiver_id: true,
      },
    });

    const userIds = new Set<number>();

    messages.forEach((msg) => {
      const isSelfMessage = msg.sender_id === msg.receiver_id;

      if (isSelfMessage) {
        userIds.add(senderId);
      } else {
        if (msg.sender_id !== senderId) userIds.add(msg.sender_id);
        if (msg.receiver_id !== senderId) userIds.add(msg.receiver_id);
      }
    });

    const otherUserIds = Array.from(userIds);

    const peopleWithLastMessage = await Promise.all(
      otherUserIds.map(async (userId) => {
        const last_message = await this.prisma.messages.findFirst({
          where: {
            OR: [
              { sender_id: senderId, receiver_id: userId },
              { sender_id: userId, receiver_id: senderId },
            ],
          },
          orderBy: {
            sent_at: 'desc',
          },
          take: 1,
        });

        const user = await this.prisma.users.findUnique({
          where: { user_id: userId },
          select: {
            user_id: true,
            full_name: true,
            avatar_url: true,
          },
        });

        return {
          user_id: user?.user_id,
          full_name: user?.full_name,
          avatar_url: user?.avatar_url,
          last_message,
        };
      }),
    );

    return peopleWithLastMessage;
  }

  findConversation(senderId: number, receiverId: number) {
    return this.prisma.messages.findMany({
      where: {
        OR: [
          {
            sender_id: senderId,
            receiver_id: receiverId,
          },
          {
            sender_id: receiverId,
            receiver_id: senderId,
          },
        ],
      },
      orderBy: {
        sent_at: 'asc',
      },
    });
  }

  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }

  remove(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      return this.prisma.messages.deleteMany({
        where: {
          sender_id: senderId,
          receiver_id: senderId,
        },
      });
    } else {
      return this.prisma.messages.deleteMany({
        where: {
          OR: [
            {
              sender_id: senderId,
              receiver_id: receiverId,
            },
            {
              sender_id: receiverId,
              receiver_id: senderId,
            },
          ],
        },
      });
    }
  }
}
