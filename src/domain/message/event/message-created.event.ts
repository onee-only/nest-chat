import { IEvent } from '@nestjs/cqrs';
import { Message } from '../entity';
import { Room } from 'src/domain/room/entity';

export class MessageCreatedEvent implements IEvent {
    constructor(public readonly room: Room, public readonly message: Message) {}
}
