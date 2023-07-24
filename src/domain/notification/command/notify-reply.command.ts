import { ICommand } from '@nestjs/cqrs';
import { Message } from 'src/domain/message/entity';
import { Room } from 'src/domain/room/entity';

export class NotifyReplyCommand implements ICommand {
    constructor(
        public readonly room: Room,
        public readonly target: Message,
        public readonly reply: Message,
    ) {}
}
