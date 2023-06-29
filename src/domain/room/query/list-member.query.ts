import { IQuery } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class ListMemberQuery implements IQuery {
    constructor(public readonly user: User, public readonly roomID: number) {}
}
