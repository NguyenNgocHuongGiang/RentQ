import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleRequestDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('role')
@ApiTags('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiResponse({status: 201,description: 'The request has been successfully created',})
  @ApiResponse({ status: 500, description: 'Internal Error' })
  create(@Body() createRoleDto: CreateRoleRequestDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiResponse({status: 200, description: 'Get successfully'})
  @ApiResponse({ status: 500, description: 'Internal Error' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':userId')
  @ApiResponse({status: 200, description: 'Get successfully'})
  @ApiResponse({status: 200, description: 'Get successfully'})
  @ApiResponse({ status: 500, description: 'Internal Error' })
  findOne(@Param('userId') userId: number) {
    return this.roleService.findOne(userId);
  }

  @Put(':id')
  @ApiResponse({status: 200, description: 'Update successfully'})
  @ApiResponse({ status: 500, description: 'Internal Error' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roleService.remove(+id);
  // }
}
