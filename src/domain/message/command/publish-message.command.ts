import { ICommand } from '@nestjs/cqrs';
import { Room } from 'src/domain/room/entity';
import { Message } from '../entity';

export class PublishMessageCommand implements ICommand {
    constructor(public readonly room: Room, public readonly message: Message) {}
}
