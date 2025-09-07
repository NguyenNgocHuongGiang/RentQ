import { Injectable } from '@nestjs/common';
import { CreateBillDto, CreateBillItemDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BillsService {
  prisma = new PrismaClient();
  async create(createBillDto: CreateBillDto) {
    const {
      contract_id,
      bill_date,
      due_date,
      total_amount,
      status,
      payment_date,
      bill_items,
    } = createBillDto;

    const billNew = await this.prisma.bills.create({
      data: {
        contract_id,
        bill_date: new Date(bill_date),
        due_date: new Date(due_date),
        total_amount,
        status,
        payment_date: payment_date ? new Date(payment_date) : null,
        bill_items: {
          create: bill_items.map((item) => ({
            item_type: item.item_type,
            description: item.description,
            amount: item.amount,
            start_number: item.start_number,
            end_number: item.end_number,
            total_price: item.total_price,
            note: item.note,
          })),
        },
      },
      include: {
        bill_items: true,
      },
    });

    return billNew;
  }

  async getBillById(billId : number){
    return this.prisma.bills.findFirst({
      where:{
        bill_id: billId
      }
    })
  }

  async findAllByLandlord(landlordId: number, year: number) {
    return this.prisma.bills.findMany({
      where: {
        contracts: {
          landlord_id: landlordId,
        },
        due_date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      include: {
        bill_items: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.bills.delete({
      where: {
        bill_id: id,
      },
    });
  }

  async getAllByTenant(tenantId: number) {
    return this.prisma.bills.findMany({
      where: {
        contracts: {
          contract_tenants: {
            some: {
              tenant_id: tenantId,
            },
          },
        },
      },
      include:{
        bill_items: true
      }
    });
  }
}
