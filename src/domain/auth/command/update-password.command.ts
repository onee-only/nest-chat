import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class UpdatePasswordCommand implements ICommand {
    constructor(
        public readonly user: User,
        public readonly currentPassword: string,
        public readonly newPassword: string,
    ) {}
}
