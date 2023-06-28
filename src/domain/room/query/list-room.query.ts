import { IQuery } from '@nestjs/cqrs';
import { RoomOrder, RoomOrderDir } from '../enum';
import { User } from 'src/domain/user/entity';

export type ListOptions = {
    readonly page: number;
    readonly order: RoomOrder;
    readonly orderDir: RoomOrderDir;
    readonly size?: number;
    readonly query?: string;
    readonly startDate?: Date;
    readonly endDate?: Date;
};

export class ListRoomQuery implements IQuery {
    constructor(
        public readonly user: User,
        public readonly options: ListOptions,
    ) {}
}
