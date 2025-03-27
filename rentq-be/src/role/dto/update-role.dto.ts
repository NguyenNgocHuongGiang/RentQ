import { PartialType } from '@nestjs/swagger';
import { CreateRoleRequestDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleRequestDto) {}
