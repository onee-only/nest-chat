import { IEvent } from '@nestjs/cqrs';
import { Thread } from 'src/domain/thread/entity';
import { Message } from '../entity';

export class MessageCreatedEvent implements IEvent {
    constructor(
        public readonly thread: Thread,
        public readonly message: Message,
    ) {}
}
