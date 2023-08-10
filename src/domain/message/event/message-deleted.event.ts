import { IEvent } from '@nestjs/cqrs';
import { Message } from '../entity';
import { Room } from 'src/domain/room/entity';
import { Thread } from 'src/domain/thread/entity';

export class MessageDeletedEvent implements IEvent {
    constructor(
        public readonly room: Room,
        public readonly thread: Thread,
        public readonly message: Message,
    ) {}
}
