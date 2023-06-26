import { Global, Module } from '@nestjs/common';
import { BlackListService } from './blacklist.service';

@Global()
@Module({
    providers: [BlackListService],
    exports: [BlackListService],
})
export class BlackListModule {}
