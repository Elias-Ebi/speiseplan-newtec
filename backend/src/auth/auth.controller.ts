import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { User } from '../data/entitites/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Post('register')
  register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ): Promise<User> {
    return this.authService.register(email, password, name);
  }

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): { accessToken: string } {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req): User {
    return req.user;
  }
}
