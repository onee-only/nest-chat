import { ICommand } from '@nestjs/cqrs';
import { Room } from 'src/domain/room/entity';
import { Thread } from 'src/domain/thread/entity';
import { Message } from '../entity';

export class PublishDeleteCommand implements ICommand {
    constructor(
        public readonly room: Room,
        public readonly thread: Thread,
        public readonly message: Message,
    ) {}
}
