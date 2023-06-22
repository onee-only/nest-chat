import { IQuery } from '@nestjs/cqrs';
import { User } from '../entity';

export class GetProfileQuery implements IQuery {
    constructor(public readonly user: User) {}
}
