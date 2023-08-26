import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class DeleteNotificationCommand implements ICommand {
    constructor(public readonly uuid: string, public readonly user: User) {}
}
