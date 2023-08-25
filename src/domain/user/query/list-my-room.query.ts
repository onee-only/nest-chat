import { IQuery } from '@nestjs/cqrs';
import { User } from '../entity';

export class ListMyRoomQuery implements IQuery {
    constructor(public readonly user: User) {}
}
