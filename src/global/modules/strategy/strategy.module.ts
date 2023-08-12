import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/domain/user/user.module';
import {
    IJwtConfig,
    JWT_CONFIG,
    JwtAccessStrategy,
    JwtRefreshStrategy,
} from './jwt';

@Global()
@Module({
    imports: [
        ConfigModule,
        PassportModule,
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<IJwtConfig>(JWT_CONFIG).access.secret,
                signOptions: {
                    expiresIn:
                        configService.get<IJwtConfig>(JWT_CONFIG).access
                            .expiration,
                },
            }),
        }),
    ],
    providers: [JwtAccessStrategy, JwtRefreshStrategy],
    exports: [JwtAccessStrategy, JwtRefreshStrategy, JwtModule],
})
export class StrategyModule {}
