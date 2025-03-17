import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, ResendMailDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: HttpStatus.OK, description: 'Register successfullly' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server',
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successfullly' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server',
  })
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Get('verify-email')
  @ApiResponse({ status: HttpStatus.OK, description: 'Verify successfullly' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server',
  })
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
    
  }

  @Post('resend-email')
  @ApiResponse({ status: HttpStatus.OK, description: 'Resend successfullly' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server',
  })
  async resendEmail(@Body() body: ResendMailDto) {
      const { email } = body;
      return await this.authService.resendVerificationEmail(email);
     
  }
}
