import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { UpdatePropertyImageDto } from './dto/update-property-image.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PropertyImagesService {
  prisma = new PrismaClient();

  create(createListingImageDto: CreatePropertyImageDto) {
    return this.prisma.property_images.create({
      data: {
        property_id: createListingImageDto.property_id,
        image_url: createListingImageDto.images_url,
        is_main: createListingImageDto.is_main,
      },
    });
  }

  findAll() {
    return `This action returns all listingImages`;
  }

  findByPropertyId(id: number) {
    return this.prisma.property_images.findMany({
      where: {
        property_id: id,
      },
    });
  }

  async update(url: string, status: boolean) {
    console.log(url);
    
    // Tìm ảnh theo URL
    const image = await this.prisma.property_images.findFirst({
      where: {
        image_url: url,
      },
    });
  
    if (!image) {
      throw new NotFoundException('Image not found');
    }
  
    await this.prisma.property_images.update({
      where: {
        image_id: image.image_id,
      },
      data: {
        is_main: status,
      },
    });
  
    const updatedImages = await this.prisma.property_images.findMany({
      where: {
        property_id: image.property_id, 
      },
    });
  
    return updatedImages;
  }
  

  async remove(url: string) {
    const image = await this.prisma.property_images.findFirst({
      where: {
        image_url: url,
      },
    });

    if (!image) {
      throw new Error('Image not found');
    }

    return this.prisma.property_images.delete({
      where: {
        image_id: image.image_id,
      },
    });
  }
}
