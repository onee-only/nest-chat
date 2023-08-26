import { IQuery } from '@nestjs/cqrs';

export class ListTagQuery implements IQuery {
    constructor(
        public readonly keyword: string,
        public readonly limit: number,
    ) {}
}
