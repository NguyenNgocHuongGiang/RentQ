import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ListingsModule } from './listings/listings.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),UserModule, AuthModule, FileUploadModule, ListingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
