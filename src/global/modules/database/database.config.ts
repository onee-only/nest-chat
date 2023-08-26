import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';

export const DB_CONFIG = 'database';

export const DatabaseValidationScheme = () =>
    Joi.object({
        DB: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
    });

export const DatabaseConfig = registerAs(
    DB_CONFIG,
    (): TypeOrmModuleOptions => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        entities: [__dirname + '/../../../**/*.entity.{js,ts}'],
        synchronize: true,
        bigNumberStrings: false,
        logging:
            process.env.NODE_ENV === 'dev'
                ? ['error', 'info', 'log', 'query', 'warn']
                : ['error', 'migration', 'schema', 'log'],
    }),
);
