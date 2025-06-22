import { Module } from '@nestjs/common';
import { ContractTenantsService } from './contract_tenants.service';
import { ContractTenantsController } from './contract_tenants.controller';

@Module({
  controllers: [ContractTenantsController],
  providers: [ContractTenantsService],
})
export class ContractTenantsModule {}
