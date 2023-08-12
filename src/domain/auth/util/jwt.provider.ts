import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtConfig, JWT_CONFIG } from 'src/global/modules/strategy/jwt';
import { TokenPayload } from 'src/global/modules/strategy/jwt/payloads';

@Injectable()
export class JwtProvider implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    private jwtConfig: IJwtConfig;

    async onModuleInit() {
        this.jwtConfig = this.configService.get<IJwtConfig>(JWT_CONFIG);
    }

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

    getRefreshExpiration(): number {
        const { access } = this.getJwtConfig();
        return access.expiration;
    }

    private getJwtConfig(): IJwtConfig {
        return this.jwtConfig;
    }
}
