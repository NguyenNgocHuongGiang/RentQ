import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PropertyImagesService } from './property-images.service';
import { CreatePropertyImageDto, CreatePropertyImageListDto } from './dto/create-property-image.dto';
import { UpdatePropertyImageDto } from './dto/update-property-image.dto';

@Controller('property-images')
export class PropertyImagesController {
  constructor(private readonly propertyImagesService: PropertyImagesService) {}
 
  @Post()
  async create(@Body() createListingImageDto: CreatePropertyImageListDto) {
    const { property_id, images_url_list, is_main_list } = createListingImageDto;

    for (let i = 0; i < images_url_list.length; i++) {
      const image: CreatePropertyImageDto = {
        property_id,
        images_url: images_url_list[i],
        is_main: is_main_list[i],
      };
      await this.propertyImagesService.create(image);
    }
    return 'Successfully created';
  }

  @Get()
  findAll() {
    return this.propertyImagesService.findAll();
  }

  // @Get('get-by-listingId/:listingId')
  // findByListingId(@Param('listingId') id: string) {
  //   return this.propertyImagesService.findByListingId(+id);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.propertyImagesService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListingImageDto: UpdatePropertyImageDto) {
    return this.propertyImagesService.update(+id, updateListingImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyImagesService.remove(+id);
  }
}
