import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    DatabaseConfig,
    DatabaseValidationScheme,
    EmailConfig,
    EmailValidationScheme,
    IEmailConfig,
    JwtConfig,
    JwtValidationScheme,
    ServerConfig,
    ServerValidationScheme,
} from './global/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategyModule } from './global/strategies/strategy.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import Joi from 'joi';

@Module({
    imports: [
        // config
        ConfigModule.forRoot({
            envFilePath: [
                `${__dirname}/global/config/env/.${process.env.NODE_ENV}.env`,
            ],
            validationSchema: Joi.object()
                .append(ServerValidationScheme)
                .append(DatabaseValidationScheme)
                .append(JwtValidationScheme)
                .append(EmailValidationScheme),
            load: [ServerConfig, DatabaseConfig, JwtConfig, EmailConfig],
            isGlobal: true,
        }),

        // typeorm
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
                config.get(DatabaseConfig.KEY),
        }),

        // nodemailer
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
                config.get<IEmailConfig>(EmailConfig.KEY).moduleOptions,
        }),

        // strategy
        StrategyModule,

        // app modules
        AuthModule,
        UserModule,
    ],
})
export class AppModule {}
