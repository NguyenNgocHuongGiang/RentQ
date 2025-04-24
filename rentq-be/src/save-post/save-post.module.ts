import { Module } from '@nestjs/common';
import { SavePostService } from './save-post.service';
import { SavePostController } from './save-post.controller';

@Module({
  controllers: [SavePostController],
  providers: [SavePostService],
})
export class SavePostModule {}
