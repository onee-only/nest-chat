import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class DeleteRoomCommand implements ICommand {
    constructor(public readonly user: User, public readonly roomID: number) {}
}
