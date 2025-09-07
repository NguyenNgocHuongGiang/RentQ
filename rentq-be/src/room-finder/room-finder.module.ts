import { Module } from '@nestjs/common';
import { RoomFinderService } from './room-finder.service';
import { RoomFinderController } from './room-finder.controller';

@Module({
  controllers: [RoomFinderController],
  providers: [RoomFinderService],
})
export class RoomFinderModule {}
