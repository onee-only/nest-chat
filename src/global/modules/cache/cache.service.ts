import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
    constructor(private readonly client: Redis) {}

    async get(key: string): Promise<string> {
        return await this.client.get(key);
    }

    async set(key: string, value: string, expiresAt?: Date): Promise<void> {
        await this.client.set(key, value);
        if (expiresAt !== undefined) {
            await this.client.pexpireat(key, expiresAt.getTime());
        }
    }

    async del(...keys: string[]): Promise<void> {
        await this.client.del([...keys]);
    }
}
