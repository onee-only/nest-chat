import { IEvent } from '@nestjs/cqrs';
import { Room } from 'src/domain/room/entity';
import { Message } from '../entity';
import { Thread } from 'src/domain/thread/entity';

export class MessageUpdatedEvent implements IEvent {
    constructor(
        public readonly room: Room,
        public readonly thread: Thread,
        public readonly message: Message,
    ) {}
}
