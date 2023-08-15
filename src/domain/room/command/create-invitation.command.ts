import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class CreateInvitationCommand implements ICommand {
    constructor(
        public readonly roomID: number,
        public readonly alias: string,
        public readonly duration: number,
        public readonly user: User,
    ) {}
}
