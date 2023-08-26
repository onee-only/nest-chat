import { Global, Module } from '@nestjs/common';
import { BlackListService } from './blacklist.service';
import { CacheModule } from '../redis';

@Global()
@Module({
    imports: [CacheModule],
    providers: [BlackListService],
    exports: [BlackListService],
})
export class BlackListModule {}
