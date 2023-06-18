import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class SendEmailCommand implements ICommand {
    constructor(public readonly user: User) {}
}
