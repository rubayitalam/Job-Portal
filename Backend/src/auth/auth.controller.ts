
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto); // Call register method from AuthService
  }

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto); // Call login method from AuthService
  }
}
