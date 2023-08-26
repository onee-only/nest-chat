import { IEvent } from '@nestjs/cqrs';
import { MemberRole, Room } from 'src/domain/room/entity';
import { Message } from '../entity';

export class RoleMentionedEvent implements IEvent {
    constructor(
        public readonly room: Room,
        public readonly roles: MemberRole[],
        public readonly message: Message,
    ) {}
}
