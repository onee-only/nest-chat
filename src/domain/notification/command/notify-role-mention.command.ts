import { ICommand } from '@nestjs/cqrs';
import { Message } from 'src/domain/message/entity';
import { MemberRole, Room } from 'src/domain/room/entity';

export class NotifyRoleMentionCommand implements ICommand {
    constructor(
        public readonly room: Room,
        public readonly roles: MemberRole[],
        public readonly message: Message,
    ) {}
}
