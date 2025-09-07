import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBankAccountDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient, users } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  prisma = new PrismaClient();

  async create(createUserDto: CreateUserDto): Promise<users> {
    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.users.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll(): Promise<users[]> {
    return await this.prisma.users.findMany();
  }

  async findOne(id: number): Promise<users> {
    const user = await this.prisma.users.findUnique({
      where: { user_id: id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<users> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.users.update({
      where: { user_id: id },
      data: updateUserDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.users.delete({
      where: { user_id: id },
    });
  }

  async findByEmail(email: string): Promise<users> {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async createBankAccount(createBankAccountDto: CreateBankAccountDto) {
    await this.prisma.bank_account.updateMany({
      where: {
        user_id: createBankAccountDto.user_id,
        is_default: true,
      },
      data: {
        is_default: false,
      },
    });

    return this.prisma.bank_account.create({
      data: createBankAccountDto,
    });
  }

  async getBankAccount(userId: number) {
    return this.prisma.bank_account.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async getBankAccountDefault(userId: number) {
    return this.prisma.bank_account.findFirst({
      where: {
        user_id: userId,
        is_default: true,
      },
    });
  }

  async getUserPostProfile(userId: number) {
    const [posts, roomFinder, roommateRequest] = await Promise.all([
      this.prisma.posts.findMany({
        where: { properties: { landlord_id: userId } },
        include: {
          properties: {
            include: {
              property_images: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.roommate_finder.findMany({
        where: { tenant_id: userId },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.roommate_requests.findMany({
        where: { tenant_id: userId },
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
          users: true
        },
        orderBy: { created_at: 'desc' },
      }),
    ]);

    const postsWithLabel = posts.map((p) => ({
      ...p,
      label: 'post',
      unique_id: `post-${p.post_id}`,
    }));

    const roomFinderWithLabel = roomFinder.map((r) => ({
      ...r,
      label: 'room_finder',
      unique_id: `room-${r.finder_id}`,
    }));

    const roommateRequestWithLabel = roommateRequest.map((r) => ({
      ...r,
      label: 'roommate-requests',
      unique_id: `roommate-requests-${r.request_id}`,
    }));

    const combined = [
      ...postsWithLabel,
      ...roomFinderWithLabel,
      ...roommateRequestWithLabel,
    ].sort((a, b) => {
      const bTime = b.created_at ? b.created_at.getTime() : 0;
      const aTime = a.created_at ? a.created_at.getTime() : 0;
      return bTime - aTime;
    });

    return combined;
  }
}
