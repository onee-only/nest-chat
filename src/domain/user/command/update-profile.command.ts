import { ICommand } from '@nestjs/cqrs';
import { User } from '../entity';

type UpdateData = {
    readonly nickname?: string;
    readonly bio?: string;
    readonly profileURL?: string;
};

export class UpdateProfileCommand implements ICommand {
    constructor(public readonly user: User, public readonly data: UpdateData) {}
}
