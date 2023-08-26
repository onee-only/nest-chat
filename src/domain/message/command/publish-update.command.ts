import { ICommand } from '@nestjs/cqrs';
import { Message } from '../entity';
import { Room } from 'src/domain/room/entity';
import { Thread } from 'src/domain/thread/entity';

export class PublishUpdateCommand implements ICommand {
    constructor(
        public readonly room: Room,
        public readonly thread: Thread,
        public readonly message: Message,
    ) {}
}
