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

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: environment.jwtSecretKey
    }),
    TypeOrmModule.forFeature([User, Profile])
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {
}
