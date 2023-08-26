import { IQuery } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';
import { ThreadOrder, ThreadOrderDir } from '../enum';

export type ListOptions = {
    readonly roomID: number;
    readonly page: number;
    readonly order: ThreadOrder;
    readonly orderDir: ThreadOrderDir;
    readonly size?: number;
    readonly query?: string;
    readonly startDate?: Date;
    readonly endDate?: Date;
    readonly tags?: string[];
};

export class ListThreadQuery implements IQuery {
    constructor(
        public readonly user: User,
        public readonly options: ListOptions,
    ) {}
}
