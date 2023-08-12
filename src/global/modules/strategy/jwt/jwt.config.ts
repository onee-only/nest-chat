import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export type IJwtConfig = {
    access: {
        secret: string;
        expiration: number;
    };
    refresh: {
        secret: string;
        expiration: number;
    };
};

export const JWT_CONFIG = 'jwt';

export const JwtValidationScheme = () =>
    Joi.object({
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.number().required(),
    });

export const JwtConfig = registerAs(
    JWT_CONFIG,
    (): IJwtConfig => ({
        access: {
            secret: process.env.JWT_ACCESS_SECRET,
            expiration: parseInt(process.env.JWT_ACCESS_EXPIRATION_TIME),
        },
        refresh: {
            secret: process.env.JWT_REFRESH_SECRET,
            expiration: parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME),
        },
    }),
);
