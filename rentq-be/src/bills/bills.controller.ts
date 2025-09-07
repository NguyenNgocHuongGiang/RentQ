import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { ApiTags } from '@nestjs/swagger';
import { AutoApiResponse } from 'src/auto-api-response.decorator';

@Controller('bills')
@ApiTags('Bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  @AutoApiResponse('POST')
  create(@Body() createBillDto: CreateBillDto) {
    return this.billsService.create(createBillDto);
  }

  @Get('/get-by-landlordId/:id')
  @AutoApiResponse('GET')
  findAll(@Param('id') id: string, @Query('year') year?: string) {
    const yearNumber = year ? +year : new Date().getFullYear();
    return this.billsService.findAllByLandlord(+id, yearNumber);
  }

  @Get('/get-by-tenantId/:id')
  @AutoApiResponse('GET')
  findAllByTenantId(@Param('id') id: string) {
    return this.billsService.getAllByTenant(+id);
  }

  @Delete(':id')
  @AutoApiResponse('DELETE')
  remove(@Param('id') id: string) {
    return this.billsService.remove(+id);
  }
}
