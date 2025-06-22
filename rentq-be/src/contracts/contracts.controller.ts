import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ApiTags } from '@nestjs/swagger';
import { AutoApiResponse } from 'src/auto-api-response.decorator';

@Controller('contracts')
@ApiTags('Contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @AutoApiResponse('POST')
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractsService.create(createContractDto);
  }

  // @Get()
  // findAll() {
  //   return this.contractsService.findAll();
  // }

  @Get('/get-contract-by-landlordId/:landlord_id')
  @AutoApiResponse('GET')
  findOne(@Param('landlord_id') id: string) {
    return this.contractsService.getContractByLandlordID(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
  //   return this.contractsService.update(+id, updateContractDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.contractsService.remove(+id);
  // }
}
