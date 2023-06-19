import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export type IServerConfig = {
    frontend: {
        domain: string;
        emailVerifyPath: string;
    };
};

export const ServerValidationScheme = Joi.object({
    FRONTEND_DOMAIN: Joi.string().domain(),
    FRONTEND_EMAIL_VERIFY_PATH: Joi.string(),
});

export const ServerConfig = registerAs(
    'server',
    (): IServerConfig => ({
        frontend: {
            domain: process.env.FRONTEND_DOMAIN,
            emailVerifyPath: process.env.FRONTEND_EMAIL_VERIFY_PATH,
        },
    }),
);
