import { IEvent } from '@nestjs/cqrs';
import { MemberRole } from 'src/domain/room/entity';
import { Message } from '../entity';

export class RoleMentionedEvent implements IEvent {
    constructor(
        public readonly roles: MemberRole[],
        public readonly message: Message,
    ) {}
}
