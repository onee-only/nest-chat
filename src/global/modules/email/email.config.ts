import { registerAs } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import * as Joi from 'joi';

export type IEmailConfig = {
    duration: number;
    moduleOptions: MailerOptions;
};

export const EmailValidationScheme = () =>
    Joi.object({
        MAIL_EXPIRE_DURATION_MS: Joi.number().required(),
        MAIL_USER: Joi.string().email().required(),
        MAIL_PASS: Joi.string().required(),
    });

export const EmailConfig = registerAs(
    'email',
    (): IEmailConfig => ({
        duration: parseInt(process.env.EMAIL_EXPIRE_DURATION_MS),
        moduleOptions: {
            transport: {
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            },
            defaults: {
                from: '"simple-chat" <simple@chat.com>',
            },
            template: {
                dir: __dirname + '../../../../resource/mail',
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        },
    }),
);
