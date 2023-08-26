import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class DeleteInvitationCommand implements ICommand {
    constructor(
        public readonly roomID: number,
        public readonly token: string,
        public readonly user: User,
    ) {}
}
