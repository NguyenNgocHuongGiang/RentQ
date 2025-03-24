import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
@ApiTags('file-upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Upload successfullly' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server',
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      const maxSize = 1 * 1024 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new BadRequestException(
          'File size is too large. Max file size is 1GB',
        );
      }
      console.log(file.mimetype);

      const imageUrl = await this.fileUploadService.uploadFile(file);
      return { imageUrl };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  @Post('multiple-files')
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Upload successfullly' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server',
  })
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      const maxSize = 1 * 1024 * 1024 * 1024;
      for (const file of files) {
        if (file.size > maxSize) {
          throw new BadRequestException(
            `File ${file.originalname} is too large. Max file size is 1GB`,
          );
        }
      }

      const imageUrls = await this.fileUploadService.uploadMultipleFiles(files);
      return { imageUrls };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}
