import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class ClearNotificationsCommand implements ICommand {
    constructor(public readonly user: User) {}
}
