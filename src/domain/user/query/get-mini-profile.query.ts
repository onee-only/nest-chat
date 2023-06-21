import { IQuery } from '@nestjs/cqrs';
import { User } from '../entity';

export class GetMiniProfileQuery implements IQuery {
    constructor(public readonly user: User) {}
}
