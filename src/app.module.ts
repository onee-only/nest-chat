import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig, DatabaseValidationScheme } from './global/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';

@Module({
    imports: [
        // config
        ConfigModule.forRoot({
            envFilePath: [
                `${__dirname}/global/config/env/.${process.env.NODE_ENV}.env`,
            ],
            validationSchema: Joi.object().append(DatabaseValidationScheme),
            load: [DatabaseConfig],
            isGlobal: true,
        }),

        // typeorm
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) =>
                config.get(DatabaseConfig.KEY),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
