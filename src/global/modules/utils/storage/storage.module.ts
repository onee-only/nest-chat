import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { StorageManager } from './storage.manager';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        MulterModule.register({
            limits: {
                fileSize: 1024 * 1024 * 10, // 10MB
                files: 5,
            },
        }),
    ],
    providers: [StorageManager],
})
export class StorageModule {}
