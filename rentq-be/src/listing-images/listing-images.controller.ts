import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListingImagesService } from './listing-images.service';
import { CreateListingImageDto, CreateListingImageInputDto } from './dto/create-listing-image.dto';
import { UpdateListingImageDto } from './dto/update-listing-image.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('listing-images')
@ApiTags('listing-images')
export class ListingImagesController {
  constructor(private readonly listingImagesService: ListingImagesService) {}

  @Post()
  async create(@Body() createListingImageDto: CreateListingImageInputDto) {
    const { listing_id, images_url, isMain } = createListingImageDto;

    for (let i = 0; i < images_url.length; i++) {
      const image: CreateListingImageDto = {
        listing_id,
        images_url: images_url[i],
        isMain: isMain[i],
      };
      await this.listingImagesService.create(image);
    }
    return 'Successfully created';
  }

  @Get()
  findAll() {
    return this.listingImagesService.findAll();
  }

  @Get('get-by-listingId/:listingId')
  findByListingId(@Param('listingId') id: string) {
    return this.listingImagesService.findByListingId(+id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.listingImagesService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListingImageDto: UpdateListingImageDto) {
    return this.listingImagesService.update(+id, updateListingImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingImagesService.remove(+id);
  }
}
