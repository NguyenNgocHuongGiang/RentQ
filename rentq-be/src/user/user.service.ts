import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
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
    return this.prisma.users.findMany();
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
}