import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from './payloads/token.payload';
import { UserRepository } from 'src/domain/user/repository/user.repository';
import { User } from 'src/domain/user/entity';
import { IJwtConfig, JWT_CONFIG } from './jwt.config';

function extractFromCookie(req: Request): string {
    return req.cookies['refreshToken'] as string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([extractFromCookie]),
            secretOrKey:
                configService.get<IJwtConfig>(JWT_CONFIG).refresh.secret,
            ignoreExpiration: false,
        });
    }
    async validate({ userID }: TokenPayload): Promise<User> {
        return await this.userRepository.findOneBy({ id: userID });
    }
}
