import { IEvent } from '@nestjs/cqrs';
import { Room, RoomMember } from 'src/domain/room/entity';
import { Message } from '../entity';

export class MemberMentionedEvent implements IEvent {
    constructor(
        public readonly room: Room,
        public readonly members: RoomMember[],
        public readonly message: Message,
    ) {}
}
