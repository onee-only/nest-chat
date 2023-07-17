import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

type MessageInput = {
    readonly body: string;
    readonly replyTo?: number;
    readonly embedments?: Array<Express.Multer.File>;
};

export class CreateMessageCommand implements ICommand {
    constructor(
        public readonly roomID: number,
        public readonly threadID: number,
        public readonly user: User,
        public readonly data: MessageInput,
    ) {}
}
