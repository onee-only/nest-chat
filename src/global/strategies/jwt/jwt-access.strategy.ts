import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtConfig, JwtConfig } from 'src/global/config';
import { TokenPayload } from './payloads/token.payload';
import { UserRepository } from 'src/domain/user/repository/user.repository';
import { User } from 'src/domain/user/entity';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<IJwtConfig>(JwtConfig.KEY).access
                .secret,
            ignoreExpiration: false,
        });
    }
    async validate({ userID }: TokenPayload): Promise<User> {
        return await this.userRepository.findOneBy({ id: userID });
    }
}
