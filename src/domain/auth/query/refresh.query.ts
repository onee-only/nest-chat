import { IQuery } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class RefreshQuery implements IQuery {
    constructor(public readonly user: User) {}
}
