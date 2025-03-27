import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ListingsModule } from './listings/listings.module';
import { RoleModule } from './role/role.module';
import { ListingImagesModule } from './listing-images/listing-images.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),UserModule, AuthModule, FileUploadModule, ListingsModule, RoleModule, ListingImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
