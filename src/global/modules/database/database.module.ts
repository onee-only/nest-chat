import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONFIG } from './database.config';

@Module({
    imports: [
        // typeorm
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => config.get(DB_CONFIG),
        }),
    ],
})
export class DatabaseModule {}
