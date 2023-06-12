import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export type IJwtConfig = {
    access: {
        secret: string;
        expiration: string;
    };
    refresh: {
        secret: string;
        expiration: string;
    };
};

export const JwtValidationScheme = Joi.object({
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRATION_TIME: Joi.string().required(),
    JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
});

export const JwtConfig = registerAs(
    'jwt',
    (): IJwtConfig => ({
        access: {
            secret: process.env.JWT_ACCESS_SECRET,
            expiration: process.env.JWT_ACCESS_EXPIRATION_TIME,
        },
        refresh: {
            secret: process.env.JWT_REFRESH_SECRET,
            expiration: process.env.JWT_REFRESH_EXPIRATION_TIME,
        },
    }),
);
