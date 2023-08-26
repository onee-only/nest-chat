import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class CreateThreadCommand implements ICommand {
    constructor(
        public readonly user: User,
        public readonly roomID: number,
        public readonly title: string,
    ) {}
}
