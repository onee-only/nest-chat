import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectValidator {
    /**
     * checks if the given value is type of object
     */
    public isObject(value: any): boolean {
        return typeof value === 'object';
    }

    /**
     * checks if the given object is emtpy
     * @example const a = {};
     *
     * this.isEmpty(a); // true
     */
    public isEmpty(obj: object): boolean {
        return Object.keys(obj).length === 0;
    }
}
