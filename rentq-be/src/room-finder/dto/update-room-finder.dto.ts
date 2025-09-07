import { PartialType } from '@nestjs/swagger';
import { CreateRoomFinderDto } from './create-room-finder.dto';

export class UpdateRoomFinderDto extends PartialType(CreateRoomFinderDto) {}
