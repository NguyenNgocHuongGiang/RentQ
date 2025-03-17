import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.APP_PASS,
    },
  });

  async sendVerificationEmail(to: string, token: string) {
    const url = `${process.env.BASE_URL}auth/verify-email?token=${token}`; 

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: '🔐 Xác thực tài khoản - Hành động cần thiết!',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h1 style="color: #333;">🎉 Chào mừng bạn đến với RentQ!</h1>
            <p>Chúng tôi rất vui khi bạn tham gia. Để hoàn tất đăng ký, vui lòng xác thực email của bạn.</p>
            <a href="${url}" 
               style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; font-weight: bold; color: #fff; background-color: green; text-decoration: none; border-radius: 5px;">
               Xác thực tài khoản ngay
            </a>
            <p style="color: #555;">Liên kết này sẽ hết hạn sau <strong>15 phút</strong>. Nếu bạn không yêu cầu đăng ký, hãy bỏ qua email này.</p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #888;">© 2025 RentQ. Mọi quyền được bảo lưu.</p>
          </div>
        `,
      };
      

    await this.transporter.sendMail(mailOptions);
  }
}
