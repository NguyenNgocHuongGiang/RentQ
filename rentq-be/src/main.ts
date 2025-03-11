import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: '*', 
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: 'Content-Type, Authorization',
  });

  const configSwagger = new DocumentBuilder()
  .setTitle('RentQ')
  .setVersion("1.0")
  .addBearerAuth()
  .build() 

  const swagger = SwaggerModule.createDocument(app, configSwagger)
  SwaggerModule.setup("swagger", app, swagger)

  const port = configService.get<number>('PORT') || 8080

  await app.listen(port);
}
bootstrap();
