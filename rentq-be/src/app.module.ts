import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { RoleModule } from './role/role.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PropertiesModule } from './properties/properties.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),UserModule, AuthModule, FileUploadModule, RoleModule, ReviewsModule, PropertiesModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
