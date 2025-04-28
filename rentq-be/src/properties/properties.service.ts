import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PropertiesService {
  prisma = new PrismaClient();

  async create(createPropertyDto: CreatePropertyDto) {
    const { landlord_id } = createPropertyDto;
    const landlord = await this.prisma.users.findUnique({
      where: { user_id: landlord_id },
    });
    if (!landlord) {
      throw new NotFoundException(`Landlord not found`);
    }
    const { is_verified } = landlord;
    if (!is_verified) {
      throw new BadRequestException(`Landlord is not verified`);
    }
    return await this.prisma.properties.create({
      data: {
        ...createPropertyDto,
      },
    });
  }

  async findAll() {
    return await this.prisma.properties.findMany();
  }

  async getUserProperties(id: number) {
    return await this.prisma.properties.findMany({
      where: { landlord_id: id },
      include:{
        property_images: true,
      }
    });
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.prisma.properties.findUnique({
      where: { property_id: id },
    });
    if (!property) {
      throw new NotFoundException(`Property not found`);
    }
    return await this.prisma.properties.update({
      where: { property_id: id },
      data: {
        ...updatePropertyDto,
      },
    });
  }

  async getPropertyLocation() {
    const properties = await this.prisma.properties.findMany({
      select: {
        address: true,
      },
    });

    const addresses = properties.map(property => {
      const addressParts = property.address.split(',');
      return addressParts.slice(1).join(',').trim(); 
    });
  
    return addresses;
  }
  

  async remove(id: number) {
    const property = await this.prisma.properties.findUnique({
      where: { property_id: id },
    });
    if (!property) {
      throw new NotFoundException(`Property not found`);
    }
    return await this.prisma.properties.delete({
      where: { property_id: id },
    });
  }
}
