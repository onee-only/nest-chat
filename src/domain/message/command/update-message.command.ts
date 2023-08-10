import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class UpdateMessageCommand implements ICommand {
    constructor(
        public readonly roomID: number,
        public readonly threadID: number,
        public readonly messageID: string,
        public readonly user: User,
        public readonly body: string,
    ) {}
}
