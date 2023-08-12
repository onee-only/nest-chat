import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export type IAwsConfig = {
    accessKey: string;
    secretKey: string;
    region: string;

    s3: {
        bucketName: string;
    };
};

export const AWS_CONFIG = 'aws';

export const AwsValidationScheme = () =>
    Joi.object({
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
    });

export const AwsConfig = registerAs(
    AWS_CONFIG,
    (): IAwsConfig => ({
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,

        s3: {
            bucketName: process.env.AWS_S3_BUCKET_NAME,
        },
    }),
);
