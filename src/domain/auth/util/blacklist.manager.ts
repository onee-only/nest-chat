import { CacheService } from 'src/global/modules/cache';
import { JwtService } from '@nestjs/jwt';

export class BlackListManager {
    constructor(
        private readonly cache: CacheService,
        private readonly jwtService: JwtService,
    ) {}

    async addToList(token: string): Promise<void> {
        const decoded = this.jwtService.decode(token);
        const exp = new Date(decoded['exp'] * 1000);

        await this.cache.set(token, '', exp);
    }

    async existsOnList(token: string): Promise<boolean> {
        return await this.cache.exists(token);
    }
}
