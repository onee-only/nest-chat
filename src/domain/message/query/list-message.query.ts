import { IQuery } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

type ListMessageOptions = {
    readonly roomID: number;
    readonly threadID: number;
    readonly endDate: Date;
    readonly limit: number;
};

export class ListMessageQuery implements IQuery {
    constructor(
        public readonly user: User,
        public readonly options: ListMessageOptions,
    ) {}
}
