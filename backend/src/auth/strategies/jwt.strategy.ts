import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../models/jwt-payload';
import { AuthUser } from '../models/AuthUser';
import { environment } from '../../environment';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.jwtSecretKey
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      email: payload.sub,
      isAdmin: payload.isAdmin
    };
  }
}
