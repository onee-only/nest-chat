import { Injectable } from '@nestjs/common';
import { NullishFilter } from './providers';

@Injectable()
export class ObjectManager {
    constructor(private readonly nullishFilter: NullishFilter) {}

    /**
     * deletes nullish property from the given object. empty object included
     */
    public filterNullish<T extends object>(obj: T): Partial<T> {
        return this.nullishFilter.execute(obj);
    }
}
