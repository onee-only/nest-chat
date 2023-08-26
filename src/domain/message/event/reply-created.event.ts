import { IEvent } from '@nestjs/cqrs';
import { Message } from '../entity';
import { Room } from 'src/domain/room/entity';

export class ReplyCreatedEvent implements IEvent {
    constructor(
        public readonly room: Room,
        public readonly target: Message,
        public readonly reply: Message,
    ) {}
}
