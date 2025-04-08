import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { configureCloudinary } from 'src/config/cloudinary.config';
import * as sharp from 'sharp';

@Injectable()
export class FileUploadService {
  constructor(private configService: ConfigService) {
    configureCloudinary(this.configService);
  }

  // async uploadFile(file: Express.Multer.File): Promise<string> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const buffer = await sharp(file.buffer)
  //         .resize({ width: 900 })
  //         .avif({ quality: 60 })
  //         .toBuffer();

  //       cloudinary.uploader.upload_stream(
  //         { folder: 'RentQ',  resource_type: 'auto' , timeout: 10000},
  //         (error, result) => {
  //           if (error) {
  //             console.error('Cloudinary error:', error);
  //             return reject(error);
  //           }
  //           if (!result) {
  //             return reject(new Error('Upload failed: No result from Cloudinary.'));
  //           }
  //           console.log('Cloudinary upload result:', result);
  //           resolve(result.secure_url);
  //         }
  //       ).end(buffer);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      // Resize chỉ khi file lớn
      console.time('sharp');
      const buffer =
        file.buffer.length > 2 * 1024 * 1024
          ? await sharp(file.buffer)
              .resize({ width: 900 })
              .avif({ quality: 50 })
              .toBuffer()
          : file.buffer;
      console.timeEnd('sharp');

      // Upload lên Cloudinary
      console.time('cloudinary');
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: 'RentQ', resource_type: 'auto', timeout: 20000 },
            (error, result) => {
              if (error) {
                console.error('Cloudinary error:', error);
                return reject(error);
              }
              if (!result) {
                return reject(
                  new Error('Upload failed: No result from Cloudinary'),
                );
              }
              console.log('Cloudinary upload result:', result);
              resolve(result.secure_url);
            },
          )
          .end(buffer);
      });
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      console.timeEnd('cloudinary');
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }
}
