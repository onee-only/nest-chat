import { Global, Module } from '@nestjs/common';
import { ObjectManager } from './object.manager';
import { NullishFilter, ObjectValidator } from './providers';

@Global()
@Module({
    providers: [NullishFilter, ObjectValidator, ObjectManager],
    exports: [ObjectManager],
})
export class ObjectUtilModule {}
