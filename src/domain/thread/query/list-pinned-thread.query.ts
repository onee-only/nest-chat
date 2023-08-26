import { IQuery } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class ListPinnedThreadQuery implements IQuery {
    constructor(public readonly roomID: number, public readonly user: User) {}
}
