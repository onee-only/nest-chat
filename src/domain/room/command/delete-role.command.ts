import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class DeleteRoleCommand implements ICommand {
    constructor(
        public readonly user: User,
        public readonly roomID: number,
        public readonly roleID: number,
    ) {}
}
