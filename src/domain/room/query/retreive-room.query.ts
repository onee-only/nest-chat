import { IQuery } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class RetreiveRoomQuery implements IQuery {
    constructor(public readonly user: User, public readonly roomID: number) {}
}
