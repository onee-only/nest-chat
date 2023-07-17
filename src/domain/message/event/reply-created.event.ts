import { IEvent } from '@nestjs/cqrs';
import { Message } from '../entity';

export class ReplyCreatedEvent implements IEvent {
    constructor(
        public readonly target: Message,
        public readonly reply: Message,
    ) {}
}
