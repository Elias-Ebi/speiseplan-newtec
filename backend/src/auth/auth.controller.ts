import {Body, Controller, Get, Param, Post, Put, Request, UseGuards} from '@nestjs/common';
import {LocalAuthGuard} from './guards/local-auth.guard';
import {AuthService} from './auth.service';
import {SkipAuth} from './decorators/skip-auth.decorator';
import {Profile} from '../data/entitites/profile.entity';
import {AuthUser} from './models/AuthUser';
import {AdminOnly} from './decorators/admin-only.decorator';

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

  @Put('change-name')
  changeName(@Request() req, @Body('name') name: string): Promise<Profile> {
    const user = req.user as AuthUser;
    return this.authService.changeName(user, name);
  }

  @Put('change-password')
  changePassword(
      @Request() req,
      @Body('currentPassword') currentPassword: string,
      @Body('newPassword') newPassword: string
  ) {
    const user = req.user as AuthUser;
    return this.authService.changePassword(user, currentPassword, newPassword);
  }

  @Get('profiles')
  @AdminOnly()
  getAllProfiles(): Promise<Profile[]> {
    return this.authService.getAllProfiles();
  }

  @Get('admin-profiles')
  @AdminOnly()
  getAllAdminProfiles(): Promise<Profile[]> {
    return this.authService.getAllAdminProfiles();
  }

  @Get('non-admin-profiles')
  @AdminOnly()
  getAllNonAdminProfiles(): Promise<Profile[]> {
    return this.authService.getAllNonAdminProfiles();
  }

  @Put('change-admin-access/:email')
  @AdminOnly()
  toggleAdminAccess(@Param('email') email: string): Promise<Profile> {
    return this.authService.toggleAdminAccess(email);
  }

  @SkipAuth()
  @Get('reset-password/:email')
  resetPassword(@Param('email') email: string): Promise<boolean> {
    return this.authService.resetPassword(email);
  }

  @SkipAuth()
  @Get('reset-password-vcode/:email')
  resetPasswordWithCode(@Param('email') email: string): Promise<boolean> {
    return this.authService.resetPasswordWithCode(email);
  }

  @SkipAuth()
  @Get('check-vcode/:code')
  checkVerificationCode(@Param('code') code: string): Promise<boolean> {
    return this.authService.checkVerificationCode(code);
  }

  @SkipAuth()
  @Put('set-password')
  setPasswordFromToken(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    return this.authService.setPasswordFromToken(token, newPassword);
  }

  @SkipAuth()
  @Put('set-password-vcode')
  setPasswordFromVerificationCode(@Body('code') code: string, @Body('newPassword') newPassword: string) {
    return this.authService.setPasswordFromVerificationCode(code, newPassword);
  }

  @Get('notify-users')
  @AdminOnly()
  async notifyUsers(): Promise<Profile[]> {
    return await this.authService.notifyUsers();
  }
}
