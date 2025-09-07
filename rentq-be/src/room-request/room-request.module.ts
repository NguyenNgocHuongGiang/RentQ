import { Module } from '@nestjs/common';
import { RoomRequestService } from './room-request.service';
import { RoomRequestController } from './room-request.controller';

@Module({
  controllers: [RoomRequestController],
  providers: [RoomRequestService],
})
export class RoomRequestModule {}
