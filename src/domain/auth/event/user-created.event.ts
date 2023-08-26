import { IEvent } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class UserCreatedEvent implements IEvent {
    constructor(public readonly user: User) {}
}
