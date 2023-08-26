import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { DatabaseConfig, DatabaseValidationScheme } from '../database';
import { EmailConfig, EmailValidationScheme } from '../email';
import { ServerConfig, ServerValidationScheme } from './server/server.config';
import { JwtConfig, JwtValidationScheme } from '../strategy/jwt';
import { CacheConfig, CacheValidationScheme } from '../cache';
import * as Joi from 'joi';
import { AwsConfig, AwsValidationScheme } from './storage';

@Module({
    imports: [
        // config
        NestConfigModule.forRoot({
            envFilePath: [`${__dirname}/env/.${process.env.NODE_ENV}.env`],
            validationSchema: Joi.object()
                .concat(EmailValidationScheme())
                .concat(JwtValidationScheme())
                .concat(DatabaseValidationScheme())
                .concat(ServerValidationScheme())
                .concat(CacheValidationScheme())
                .concat(AwsValidationScheme())
                .options({ abortEarly: false }),
            load: [
                ServerConfig,
                DatabaseConfig,
                JwtConfig,
                EmailConfig,
                CacheConfig,
                AwsConfig,
            ],
            isGlobal: true,
        }),
    ],
})
export class ConfigModule {}
