import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContractTenantDto } from './dto/create-contract_tenant.dto';
import { UpdateContractTenantDto } from './dto/update-contract_tenant.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ContractTenantsService {
  prisma = new PrismaClient();

  async create(createContractTenantDto: CreateContractTenantDto) {
    const contract = await this.prisma.contracts.findUnique({
      where: { contract_id: createContractTenantDto.contract_id },
    });

    if (!contract) {
      throw new NotFoundException(
        `Contract with ID ${createContractTenantDto.contract_id} not found`,
      );
    }

    const createdList: Awaited<
      ReturnType<typeof this.prisma.contract_tenants.create>
    >[] = [];

    for (const item of createContractTenantDto.emailList) {
      console.log(item);

      const tenant = await this.prisma.users.findFirst({
        where: {
          email: item,
        },
      });

      if (tenant) {
        const existed = await this.prisma.contract_tenants.findFirst({
          where: {
            contract_id: createContractTenantDto.contract_id,
            tenant_id: tenant.user_id,
          },
        });

        if (existed) {
          console.warn(
            `Tenant with email ${item} already exists in this contract.`,
          );
          continue; // bỏ qua nếu đã có
        }

        console.log(
          existed,
          tenant.user_id,
          createContractTenantDto.contract_id,
        );

        const res = await this.prisma.contract_tenants.create({
          data: {
            contract_id: createContractTenantDto.contract_id,
            tenant_id: tenant.user_id,
          },
        });

        createdList.push(res);
      } else {
        console.warn(`Tenant with email ${item} not found.`);
      }
    }

    return {
      message: 'Created successfully',
      data: createdList,
    };
  }

  async getByContractId(conTractId: number) {
    return await this.prisma.contract_tenants.findMany({
      where: {
        contract_id: conTractId,
      },
      include: {
        users: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  // findAll() {
  //   return `This action returns all contractTenants`;
  // }

  async getTenantContracts(tenantId: number) {
    return await this.prisma.contract_tenants.findMany({
      where: {
        tenant_id: tenantId,
      },
      include: {
        contracts: {
          include: {
            properties: true,
          },
        },
      },
    });
  }

  // update(id: number, updateContractTenantDto: UpdateContractTenantDto) {
  //   return `This action updates a #${id} contractTenant`;
  // }

  async remove(deleteContractTenantDto: CreateContractTenantDto) {
    const { contract_id, emailList } = deleteContractTenantDto;

    const users = await this.prisma.users.findMany({
      where: {
        email: { in: emailList },
      },
      select: { user_id: true },
    });

    if (!users.length) {
      throw new NotFoundException('No users found with given emails');
    }

    const userIds = users.map((u) => u.user_id);

    const deleted = await this.prisma.contract_tenants.deleteMany({
      where: {
        contract_id,
        tenant_id: { in: userIds },
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundException(
        'No tenants found for given contract and users',
      );
    }

    return deleted.count
  }
}
