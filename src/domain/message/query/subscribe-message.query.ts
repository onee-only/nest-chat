import { IQuery } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class SubscribeMessageQuery implements IQuery {
    constructor(
        public readonly roomID: number,
        public readonly threadID: number,
        public readonly user: User,
    ) {}
}
