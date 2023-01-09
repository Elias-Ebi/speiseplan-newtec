import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { JwtPayload } from '../models/jwt-payload';
import { AuthUser } from '../models/AuthUser';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      email: payload.sub,
      name: payload.name,
      isAdmin: payload.isAdmin,
    };
  }
}
