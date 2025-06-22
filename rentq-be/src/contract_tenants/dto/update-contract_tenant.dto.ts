import { PartialType } from '@nestjs/swagger';
import { CreateContractTenantDto } from './create-contract_tenant.dto';

export class UpdateContractTenantDto extends PartialType(CreateContractTenantDto) {}
