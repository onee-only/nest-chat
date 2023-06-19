import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtConfig, JwtConfig } from 'src/global/config';
import { TokenPayload } from 'src/global/strategies/jwt/payloads/token.payload';

export class JwtProvider {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async provideAccess(payload: TokenPayload): Promise<string> {
        const {
            access: { expiration: expiresIn, secret },
        } = this.getJwtConfig();

        const token = await this.jwtService.signAsync(payload, {
            expiresIn,
            secret,
        });

        return token;
    }

    async provideRefresh(payload: TokenPayload): Promise<string> {
        const {
            refresh: { expiration: expiresIn, secret },
        } = this.getJwtConfig();

        const token = await this.jwtService.signAsync(payload, {
            expiresIn,
            secret,
        });

        return token;
    }

    getAccessExpiration(): number {
        const { access } = this.getJwtConfig();
        return access.expiration;
    }

    private getJwtConfig(): IJwtConfig {
        return this.configService.get<IJwtConfig>(JwtConfig.KEY);
    }
}
