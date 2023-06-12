import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    DatabaseConfig,
    DatabaseValidationScheme,
    JwtConfig,
    JwtValidationScheme,
} from './global/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './domain/user/user.module';
import Joi from 'joi';
import { StrategyModule } from './global/strategies/strategy.module';

@Module({
    imports: [
        // config
        ConfigModule.forRoot({
            envFilePath: [
                `${__dirname}/global/config/env/.${process.env.NODE_ENV}.env`,
            ],
            validationSchema: Joi.object()
                .append(DatabaseValidationScheme)
                .append(JwtValidationScheme),
            load: [DatabaseConfig, JwtConfig],
            isGlobal: true,
        }),

        // typeorm
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) =>
                config.get(DatabaseConfig.KEY),
            inject: [ConfigService],
        }),

        // strategy
        StrategyModule,

        // app modules
        UserModule,
    ],
})
export class AppModule {}
