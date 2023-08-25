import { IQuery } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class RetreiveMemberQuery implements IQuery {
    constructor(
        public readonly user: User,
        public readonly roomID: number,
        public readonly memberID: number,
    ) {}
}
