import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { Profile } from '../data/entitites/profile.entity';
import { AuthUser } from './models/AuthUser';
import { AdminOnly } from './decorators/admin-only.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @SkipAuth()
  @Post('register')
  register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string
  ): Promise<Profile> {
    return this.authService.register(email, password, name);
  }

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): Promise<{ accessToken: string }> {
    const user = req.user as AuthUser;
    return this.authService.login(user);
  }

  @Get('profile')
  getProfile(@Request() req): Promise<Profile> {
    const user = req.user as AuthUser;
    return this.authService.getProfile(user.email);
  }

  @Get('admin-profiles')
  @AdminOnly()
  getAllAdminProfiles(@Request() req): Promise<Profile[]> {
    return this.authService.getAllAdminProfiles();
  }

  @Get('non-admin-profiles')
  @AdminOnly()
  getAllNonAdminProfiles(@Request() req): Promise<Profile[]> {
    return this.authService.getAllNonAdminProfiles();
  }

  @Put('admin-access')
  @AdminOnly()
  toggleAdminAccess(@Request() req): Promise<Profile> {
    const concernedUser = req.body.concernedUser;
    return this.authService.toggleAdminAccess(concernedUser);
  }
}
