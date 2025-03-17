import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Users') 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: CreateUserDto })
  @ApiResponse({ status: 409, description: 'Email or phone already exists.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users.', type: [CreateUserDto] })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({ status: 200, description: 'The user details.', type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string){
    return await this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // @UsePipes(new ValidationPipe())
  // @ApiOperation({ summary: 'Update a user by ID' })
  // @ApiParam({ name: 'id', description: 'User ID', type: Number })
  // @ApiBody({ type: UpdateUserDto })
  // @ApiResponse({ status: 200, description: 'The user has been successfully updated.', type: CreateUserDto })
  // @ApiResponse({ status: 404, description: 'User not found.' })
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<users> {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}