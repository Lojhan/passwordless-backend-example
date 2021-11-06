import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET_KEY || 'testing',
    });
  }

  async validate(payload: JwtPayload) {
    const user = { ...payload };

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
