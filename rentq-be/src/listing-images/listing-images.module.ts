import { Module } from '@nestjs/common';
import { ListingImagesService } from './listing-images.service';
import { ListingImagesController } from './listing-images.controller';

@Module({
  controllers: [ListingImagesController],
  providers: [ListingImagesService],
})
export class ListingImagesModule {}
