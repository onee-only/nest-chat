import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class JoinRoomCommand implements ICommand {
    constructor(
        public readonly roomID: number,
        public readonly user: User,
        public readonly token?: string,
    ) {}
}
