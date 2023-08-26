import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class KickMemberCommand implements ICommand {
    constructor(
        public readonly roomID: number,
        public readonly memberID: number,
        public readonly user: User,
    ) {}
}
