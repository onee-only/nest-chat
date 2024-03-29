import { RedisModuleOptions } from '@nestjs-modules/ioredis';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const CACHE_CONFIG = 'cache';

export const CacheValidationScheme = () =>
    Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASS:
            process.env.NODE_ENV === 'production'
                ? Joi.string().required()
                : Joi.string(),
    });

export const CacheConfig = registerAs(
    CACHE_CONFIG,
    (): RedisModuleOptions => ({
        config: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
            password: process.env.REDIS_PASS,
        },
    }),
);
