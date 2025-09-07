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
import { PropertyImagesModule } from './property-images/property-images.module';
import { SavePostModule } from './save-post/save-post.module';
import { MessageModule } from './message/message.module';
import { ContractsModule } from './contracts/contracts.module';
import { ContractTenantsModule } from './contract_tenants/contract_tenants.module';
import { BillsModule } from './bills/bills.module';
import { RoomFinderModule } from './room-finder/room-finder.module';
import { RoomRequestModule } from './room-request/room-request.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),UserModule, AuthModule, FileUploadModule, RoleModule, ReviewsModule, PropertiesModule, PostsModule, PropertyImagesModule, SavePostModule, MessageModule, ContractsModule, ContractTenantsModule, BillsModule, RoomFinderModule, RoomRequestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
