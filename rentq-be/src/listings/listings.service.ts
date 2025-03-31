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
  
    let alias = createListingDto.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  
    let uniqueAlias = alias;
    let count = 1;
  
    while (await this.prisma.listings.findFirst({ where: { alias: uniqueAlias } })) {
      uniqueAlias = `${alias}-${count}`;
      count++;
    }
  
    return this.prisma.listings.create({
      data: {
        landlord_id: createListingDto.landlordId,
        title: createListingDto.title,
        address: createListingDto.address,
        alias: uniqueAlias,
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
        address: true,
        price: true,
        alias: true,
        description: true,
        reviews: {
          select: {
            rating :true
          }
        },
        listing_images: true
      },
    });
  }

  async findAll() {
    return this.prisma.listings.findMany();
  }

  async findOne(alias: string) {
    return this.prisma.listings.findFirst({
      where: { alias: alias },
      include: {
        listing_images: true, 
        reviews: {
          select: {
            rating: true,
            comment: true,
            created_at: true,
            users: {
              select: {
                full_name: true,
                avatar_url: true
              }
            }
          }
        },
      },
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
