import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateBankAccountDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AutoApiResponse } from 'src/auto-api-response.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 409, description: 'Email or phone already exists.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all users.',
    type: [CreateUserDto],
  })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The user details.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<users> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }

  @Post('create-bank-account')
  @AutoApiResponse('POST')
  async createBankAccount(@Body() createBankAccountDto: CreateBankAccountDto) {
    return await this.usersService.createBankAccount(createBankAccountDto);
  }

  @Get('get-bank-account/:userId')
  @AutoApiResponse('GET')
  async getBankAccount(@Param('userId') userId: number) {
    return await this.usersService.getBankAccount(+userId);
  }

  @Get('get-bank-account-default/:userId')
  @AutoApiResponse('GET')
  async getBankAccountDefault(@Param('userId') userId: number) {
    return await this.usersService.getBankAccountDefault(+userId);
  }

  
  @Get('get-user-post-profile/:userId')
  @AutoApiResponse('GET')
  async getUserPostProfile(@Param('userId') userId: number) {
    return await this.usersService.getUserPostProfile(+userId);
  }
}
