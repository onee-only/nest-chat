import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class ChangeRoomOwnerCommand implements ICommand {
    constructor(
        public readonly user: User,
        public readonly roomID: number,
        public readonly memberID: number,
    ) {}
}
