import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/domain/user/user.module';
import { JwtAccessStrategy, JwtRefreshStrategy } from './jwt';
import { IJwtConfig, JwtConfig } from '../config';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<IJwtConfig>(JwtConfig.KEY).access
                    .secret,
                signOptions: {
                    expiresIn: `${
                        configService.get<IJwtConfig>(JwtConfig.KEY).access
                            .expiration
                    }s`,
                },
            }),
        }),
    ],
    providers: [JwtAccessStrategy, JwtRefreshStrategy],
    exports: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class StrategyModule {}
