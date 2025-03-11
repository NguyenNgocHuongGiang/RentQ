import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient, users_role } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  prisma = new PrismaClient();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { full_name, email, password, phone, address, avatar_url, role, is_verified } = registerDto;

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
        is_verified: is_verified
      },
    });

    return userNew;
  }

  async login(body: LoginDto): Promise<string> {
    try {
      const { email, password } = body;

      const checkUser = await this.prisma.users.findFirst({
        where: { email },
      });
      if (!checkUser) {
        throw new BadRequestException('Email is incorrect');
      }

      const checkPass = bcrypt.compareSync(password, checkUser.password);
      if (!checkPass) {
        throw new BadRequestException('Password is incorrect');
      }

      const token = this.jwtService.sign(
        { data: { userId: checkUser.user_id } },
        {
          expiresIn: '30m',
          secret: this.configService.get('SECRET_KEY'),
        },
      );
      return token;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; 
      } else {
        throw new InternalServerErrorException('An error occurred during login');
      }
    }
  }
}
