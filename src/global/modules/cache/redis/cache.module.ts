import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheConfig } from './cache.config';
import { CacheService } from './cache.service';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';

@Module({
    imports: [
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
                config.get<RedisModuleOptions>(CacheConfig.KEY),
        }),
    ],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule {}
