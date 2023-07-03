import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

type UpdateData = {
    readonly name?: string;
    readonly description?: string;
    readonly profileURL?: string;
    readonly isPublic?: boolean;
    tags?: string[];
    defaultRoleID?: number;
};

export class UpdateRoomCommand implements ICommand {
    constructor(
        public readonly user: User,
        public readonly roomID: number,
        public readonly data: UpdateData,
    ) {}
}
