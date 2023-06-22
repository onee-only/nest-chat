import { Injectable } from '@nestjs/common';
import { ObjectValidator } from './validate.service';

@Injectable()
export class NullishFilter {
    constructor(private readonly validator: ObjectValidator) {}

    /**
     * deletes nullish property from the given object. empty object included
     */
    public execute<T extends object>(obj: T): Partial<T> {
        return this.filterObject(obj);
    }

    private filterObject(obj: object): object {
        return Object.fromEntries(
            Object.entries(obj)
                .map(([key, value]) => {
                    if (value == null) {
                        return null;
                    }
                    if (this.validator.isObject(value)) {
                        if (this.validator.isEmpty(value)) {
                            return null;
                        }
                        value = this.filterObject(value);
                    }
                    return [key, value];
                })
                .filter((value) => value !== null),
        );
    }
}
