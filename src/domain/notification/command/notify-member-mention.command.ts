import { ICommand } from '@nestjs/cqrs';
import { Message } from 'src/domain/message/entity';
import { Room, RoomMember } from 'src/domain/room/entity';

export class NotifyMemberMentionCommand implements ICommand {
    constructor(
        public readonly room: Room,
        public readonly members: RoomMember[],
        public readonly message: Message,
    ) {}
}
