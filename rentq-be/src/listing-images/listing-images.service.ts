import { Injectable } from '@nestjs/common';
import { CreateListingImageDto } from './dto/create-listing-image.dto';
import { UpdateListingImageDto } from './dto/update-listing-image.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ListingImagesService {
  prisma = new PrismaClient();

  create(createListingImageDto: CreateListingImageDto) {   
    return this.prisma.listing_images.create({
      data: {
        listing_id: createListingImageDto.listing_id,
        image_url: createListingImageDto.images_url,
        is_main: createListingImageDto.isMain,
      },
    });
  }

  findAll() {
    return `This action returns all listingImages`;
  }

  findByListingId(id: number) {
    return this.prisma.listing_images.findMany({
      where:{
        listing_id: id 
      }
    });
  }

  update(id: number, updateListingImageDto: UpdateListingImageDto) {
    return `This action updates a #${id} listingImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} listingImage`;
  }
}
