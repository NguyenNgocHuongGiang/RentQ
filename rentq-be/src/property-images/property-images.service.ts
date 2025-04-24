import { Injectable } from '@nestjs/common';
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
 
   findByListingId(id: number) {
     return this.prisma.property_images.findMany({
       where:{
         property_id: id 
       }
     });
   }
 
   update(id: number, updatePropertyImageDto: UpdatePropertyImageDto) {
     return `This action updates a #${id} listingImage`;
   }
 
   remove(id: number) {
     return `This action removes a #${id} listingImage`;
   }
}
