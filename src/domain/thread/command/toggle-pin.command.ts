import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class TogglePinCommand implements ICommand {
    constructor(
        public readonly roomID: number,
        public readonly threadID: number,
        public readonly user: User,
    ) {}
}
