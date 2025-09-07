import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ContractsService {
  prisma = new PrismaClient();

  async create(createContractDto: CreateContractDto) {
    const { landlord_id } = createContractDto;
    const landlord = await this.prisma.users.findUnique({
      where: { user_id: landlord_id },
    });
    if (!landlord || landlord.role !== 'landlord') {
      throw new NotFoundException(`Landlord with ID ${landlord_id} not found`);
    }
    return this.prisma.contracts.create({
      data: {
        ...createContractDto,
      },
      include: {
        properties: true,
      },
    });
  }

  // findAll() {
  //   return `This action returns all contracts`;
  // }

  getContractByLandlordID(id: number) {
    return this.prisma.contracts.findMany({
      where: {
        landlord_id: id,
      },
      include: {
        properties: true,
      },
    });
  }

  async update(contractId: number, updateContractDto: UpdateContractDto) {
    console.log(contractId);
    
    return this.prisma.contracts.update({
      where: {
        contract_id: contractId,
      },
      data: {...updateContractDto}
    })
  }

  async remove(id: number) {
    return this.prisma.contracts.delete({
      where: {
        contract_id: id
      }
    });
  }
}
