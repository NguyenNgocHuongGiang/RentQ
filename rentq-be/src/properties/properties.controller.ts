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
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ApiTags } from '@nestjs/swagger';
import { AutoApiResponse } from 'src/auto-api-response.decorator';

@Controller('properties')
@ApiTags('Properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @AutoApiResponse('POST')
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  @AutoApiResponse('GET')
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get('tenant-properties/:userId')
  @AutoApiResponse('GET')
  getTenantProperties(@Param('userId') id: string) {
    return this.propertiesService.getTenantProperties(+id);
  }

  @Get('location')
  @AutoApiResponse('GET')
  getPropertyLocation() {
    return this.propertiesService.getPropertyLocation();
  }

  @Get(':userId')
  @AutoApiResponse('GET')
  getUserProperties(@Param('userId') id: string) {
    return this.propertiesService.getUserProperties(+id);
  }

  @Put(':propertyId')
  @AutoApiResponse('PUT')
  update(
    @Param('propertyId') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  @Delete(':propertyId')
  @AutoApiResponse('DELETE')
  remove(@Param('propertyId') id: string) {
    return this.propertiesService.remove(+id);
  }
}
