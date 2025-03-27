import { Injectable } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ListingsService {
  prisma = new PrismaClient();

  async create(createListingDto: CreateListingDto) {
    const landlord = await this.prisma.users.findUnique({
      where: { user_id: createListingDto.landlordId },
    });

    if (!landlord) {
      throw new Error('Landlord does not exist');
    }

    return this.prisma.listings.create({
      data: {
        landlord_id: createListingDto.landlordId,
        title: createListingDto.title,
        address: createListingDto.address,
        area: createListingDto.area,
        price: createListingDto.price,
        utilities: createListingDto.utilities,
        max_people: createListingDto.maxPeople,
        furniture: createListingDto.furniture,
        available_from: createListingDto.availableFrom,
        property_type: createListingDto.propertyType,
        description: createListingDto.description,
      },
    });
  }

  async findUserListings(userId: number) {
    return await this.prisma.listings.findMany({
      where: { landlord_id: userId },
      select: {
        listing_id: true,
        title: true,
        price: true,
        description: true,
        listing_images: {
          select: { image_url: true, is_main: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.listings.findMany();
  }

  async findOne(id: number) {
    return this.prisma.listings.findUnique({
      where: { listing_id: id },
    });
  }

  async update(id: number, updateListingDto: UpdateListingDto) {
    return this.prisma.listings.update({
      where: { listing_id: id },
      data: updateListingDto,
    });
  }

  async remove(id: number) {
    return this.prisma.listings.delete({
      where: { listing_id: id },
    });
  }
}
