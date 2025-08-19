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
  //   try {
  //     const isImage = file.mimetype.startsWith('image/');
  //     const isPDF = file.mimetype === 'application/pdf';

  //     const buffer =
  //       isImage && file.buffer.length > 2 * 1024 * 1024
  //         ? await sharp(file.buffer)
  //             .resize({ width: 900 })
  //             .avif({ quality: 50 })
  //             .toBuffer()
  //         : file.buffer;

  //     const resourceType = isPDF ? 'raw' : 'auto';
  //     const publicId = file.originalname.replace(/\.[^/.]+$/, '');

  //     return new Promise((resolve, reject) => {
  //       cloudinary.uploader
  //         .upload_stream(
  //           {
  //             folder: 'RentQ',
  //             resource_type: resourceType,
  //             timeout: 20000,
  //             public_id: `${publicId}`,
  //             use_filename: true,
  //             unique_filename: false,
  //           },
  //           (error, result) => {
  //             if (error) {
  //               console.error('Cloudinary error:', error);
  //               return reject(error);
  //             }
  //             if (!result) {
  //               return reject(
  //                 new Error('Upload failed: No result from Cloudinary'),
  //               );
  //             }
  //             console.log('Cloudinary upload result:', result);
  //             resolve(result.secure_url);
  //           },
  //         )
  //         .end(buffer);
  //     });
  //   } catch (error) {
  //     console.error('Upload error:', error);
  //     throw error;
  //   } finally {
  //     console.timeEnd('cloudinary');
  //   }
  // }

  // async uploadFile(file: Express.Multer.File): Promise<string> {
  //   try {
  //     console.time('sharp');
  //     const buffer =
  //       file.buffer.length > 2 * 1024 * 1024
  //         ? await sharp(file.buffer)
  //             .resize({ width: 900 })
  //             .avif({ quality: 50 })
  //             .toBuffer()
  //         : file.buffer;
  //     console.timeEnd('sharp');

  //     return new Promise((resolve, reject) => {
  //       cloudinary.uploader
  //         .upload_stream(
  //           { folder: 'RentQ', resource_type: 'auto', timeout: 20000 },
  //           (error, result) => {
  //             if (error) {
  //               console.error('Cloudinary error:', error);
  //               return reject(error);
  //             }
  //             if (!result) {
  //               return reject(
  //                 new Error('Upload failed: No result from Cloudinary'),
  //               );
  //             }
  //             console.log('Cloudinary upload result:', result);
  //             resolve(result.secure_url);
  //           },
  //         )
  //         .end(buffer);
  //     });
  //   } catch (error) {
  //     console.error('Upload error:', error);
  //     throw error;
  //   } finally {
  //     console.timeEnd('cloudinary');
  //   }
  // }

  // Down ve may
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      console.time('cloudinary');

      // Xác định loại file từ mimetype
      const isImage = file.mimetype.startsWith('image/');
      let buffer: Buffer;

      if (isImage) {
        console.time('sharp');
        buffer =
          file.buffer.length > 2 * 1024 * 1024
            ? await sharp(file.buffer)
                .resize({ width: 900 })
                .avif({ quality: 50 })
                .toBuffer()
            : file.buffer;
        console.timeEnd('sharp');
      } else {
        // Nếu là PDF hoặc file khác không phải ảnh → không dùng sharp
        buffer = file.buffer;
      }

      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'RentQ',
              resource_type: isImage ? 'image' : 'raw', // <-- Phân biệt kiểu upload
              timeout: 20000,
            },
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
