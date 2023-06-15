import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtConfig, JwtConfig } from 'src/global/config';
import { TokenPayload } from './payloads/token.payload';
import { UserRepository } from 'src/domain/user/repository/user.repository';

function extractFromCookie(req: Request): string {
    const token = req.cookies['refreshToken'] as string;
    return token;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([extractFromCookie]),
            secretOrKey: configService.get<IJwtConfig>(JwtConfig.KEY).refresh
                .secret,
            ignoreExpiration: false,
        });
    }
    async validate(payload: TokenPayload) {
        return this.userRepository.findBy({ id: payload.userID });
    }
}