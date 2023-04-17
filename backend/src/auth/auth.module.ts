import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../data/entitites/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../environment';
import { Profile } from '../data/entitites/profile.entity';
import { EmailService } from 'src/shared/email/email.service';
import { HashService } from 'src/shared/hash/hash.service';
import { ResetPasswordToken } from 'src/data/entitites/reset-password-token.entity';
import { SchedulingService } from 'src/shared/cleanup/scheduling.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: environment.jwtSecretKey
    }),
    TypeOrmModule.forFeature([User, Profile, ResetPasswordToken]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, EmailService, HashService, SchedulingService],
  exports: [AuthService]
})
export class AuthModule {
}
