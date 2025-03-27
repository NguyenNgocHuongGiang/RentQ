import { Injectable } from '@nestjs/common';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaClient } from '@prisma/client';
import { CreateRoleRequestDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  prisma = new PrismaClient();
  create(createRoleDto: CreateRoleRequestDto) {
    return this.prisma.role_requests.create({
      data: createRoleDto,
    });
  }

  findAll() {
    return this.prisma.role_requests.findMany();
  }

  findOne(userId: number) {
    const user = this.prisma.role_requests.findFirst({  
      where: { user_id: Number(userId) },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.prisma.role_requests.update({
      where: { request_id: id },
      data: updateRoleDto,
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} role`;
  // }
}
