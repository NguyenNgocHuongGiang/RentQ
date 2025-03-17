import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient, users_role } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  prisma = new PrismaClient();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService, 
  ) {}

  async register(registerDto: RegisterDto) {
    const { full_name, email, password, phone, address, role } = registerDto;

    const userExists = await this.prisma.users.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    const userNew = await this.prisma.users.create({
      data: {
        full_name: full_name,
        email: email,
        password: bcrypt.hashSync(password, 10),
        phone: phone,
        address: address,
        avatar_url: 'https://res.cloudinary.com/dlrd3ngz5/image/upload/v1738950300/kahoot_clone/bgu71soejmd8aniapnmy.jpg',
        role: role as users_role,
        is_verified: false
      },
    });

    // tao token xac thuc khi dang ky
    const verificationToken = this.jwtService.sign(
      { userId: userNew.user_id },
      {
        expiresIn: '15m',
        secret: this.configService.get('SECRET_KEY'),
      },
    );
    await this.mailService.sendVerificationEmail(email, verificationToken);

    return { message: 'User registered successfully. Please check your email to verify your account.' };
  }

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('SECRET_KEY'),
      });
  
      const user = await this.prisma.users.findUnique({
        where: { user_id: decoded.userId },
      });
  
      if (!user) {
        throw new BadRequestException('Invalid token');
      }
  
      if (user.is_verified) {
        return { message: 'Your account is already verified' };
      }
  
      // Cập nhật trạng thái xác thực
      await this.prisma.users.update({
        where: { user_id: user.user_id },
        data: { is_verified: true },
      });
  
      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async resendVerificationEmail(email: string): Promise<string> {
    const user = await this.prisma.users.findFirst({ where: { email } });

    if (!user) {
      throw new BadRequestException('Email is not registered');
    }

    if (user.is_verified) {
      throw new BadRequestException('Your email is already verified');
    }

    // Tạo token xác thực mới
    const token = this.jwtService.sign(
      { userId: user.user_id },
      {
        expiresIn: '30m',
        secret: this.configService.get('SECRET_KEY'),
      },
    );

    // Gửi email xác thực
    await this.mailService.sendVerificationEmail(email, token);
    return 'A new verification email has been sent';
  }
  
  async login(body: LoginDto) {
    const { email, password } = body;
    const user = await this.prisma.users.findFirst({ where: { email } });
  
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Email or password is incorrect');
    }

    if(!user.is_verified){
      throw new BadRequestException('Your email has not been verified yet');
    }
  
    const token = this.jwtService.sign(
      { data: { userId: user.user_id, userName: user.full_name, userRole: user.role } },
      { expiresIn: '30m', secret: this.configService.get('SECRET_KEY') }
    );
  
    return token;
  }
}
