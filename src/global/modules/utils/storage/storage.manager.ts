import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWS_CONFIG, IAwsConfig } from '../../config/storage';
import { v4 as newuuid } from 'uuid';
import * as aws from 'aws-sdk';

export type UploadResult = {
    key: string;
    originalName: string;
};

@Injectable()
export class StorageManager {
    private readonly s3: aws.S3;
    private readonly bucketName: string;

    constructor(configService: ConfigService) {
        const {
            accessKey,
            secretKey,
            region,
            s3: { bucketName },
        } = configService.get<IAwsConfig>(AWS_CONFIG);

        aws.config.update({
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
            },
            region: region,
        });
        this.s3 = new aws.S3();
        this.bucketName = bucketName;
    }

    /**
     * uploads files and gives keys
     */
    async uploadFiles(
        dir: string,
        files: Array<Express.Multer.File>,
    ): Promise<UploadResult[]> {
        return await Promise.all(
            files.map((file) => {
                const extension = this.getFileExtension(file.originalname);
                const key = `${dir}/${this.generateRandomKey()}.${extension}}`;

                return this.s3
                    .putObject({
                        Bucket: this.bucketName,
                        Key: key,
                        Body: file.buffer,
                    })
                    .promise()
                    .then(
                        (): UploadResult => ({
                            key: key,
                            originalName: file.originalname,
                        }),
                    );
            }),
        );
    }

    /**
     * deletes files
     */
    async deleteFiles(keys: string[]): Promise<void> {
        await this.s3
            .deleteObjects({
                Bucket: this.bucketName,
                Delete: { Objects: keys.map((key) => ({ Key: key })) },
            })
            .promise();
    }

    /**
     * creates s3 url of given key
     */
    getFileURL(key: string): string {
        return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    }

    private generateRandomKey(): string {
        return newuuid();
    }

    private getFileExtension(filename: string): string {
        return filename.substring(filename.indexOf('.') + 1);
    }
}
