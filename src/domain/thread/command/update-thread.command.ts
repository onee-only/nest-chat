import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

type UpdateData = {
    readonly title?: string;
    readonly tags?: string[];
};

export class UpdateThreadCommand implements ICommand {
    constructor(
        public readonly roomID: number,
        public readonly threadID: number,
        public readonly user: User,
        public readonly data: UpdateData,
    ) {}
}
