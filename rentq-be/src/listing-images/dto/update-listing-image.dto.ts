import { PartialType } from '@nestjs/swagger';
import { CreateListingImageDto } from './create-listing-image.dto';

export class UpdateListingImageDto extends PartialType(CreateListingImageDto) {}
