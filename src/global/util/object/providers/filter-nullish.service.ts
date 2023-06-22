import { Injectable } from '@nestjs/common';
import { ObjectValidator } from './validate.service';

@Injectable()
export class NullishFilter {
    constructor(private readonly validator: ObjectValidator) {}

    /**
     * deletes nullish property from the given object. empty object included
     */
    public execute<T extends object>(obj: T): Partial<T> {
        const filterObj = (obj: object): object => {
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
                            value = filterObj(value);
                        }
                        return [key, value];
                    })
                    .filter((value) => value !== null),
            );
        };

        return filterObj(obj);
    }
}
