import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContractTenantsService } from './contract_tenants.service';
import { CreateContractTenantDto } from './dto/create-contract_tenant.dto';
import { UpdateContractTenantDto } from './dto/update-contract_tenant.dto';
import { ApiTags } from '@nestjs/swagger';
import { AutoApiResponse } from 'src/auto-api-response.decorator';

@Controller('contract-tenants')
@ApiTags('Contract Tenants')
export class ContractTenantsController {
  constructor(private readonly contractTenantsService: ContractTenantsService) {}

  @Post()
  @AutoApiResponse('POST')
  create(@Body() createContractTenantDto: CreateContractTenantDto) {
    return this.contractTenantsService.create(createContractTenantDto);
  }

  // @Get()
  // findAll() {
  //   return this.contractTenantsService.findAll();
  // }

  @Get(':tenantId')
  @AutoApiResponse('GET')
  findOne(@Param('tenantId') tenantId: string) {
    return this.contractTenantsService.getTenantContracts(+tenantId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateContractTenantDto: UpdateContractTenantDto) {
  //   return this.contractTenantsService.update(+id, updateContractTenantDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.contractTenantsService.remove(+id);
  // }
}
