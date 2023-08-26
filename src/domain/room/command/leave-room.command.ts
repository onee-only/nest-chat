import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';

export class LeaveRoomCommand implements ICommand {
    constructor(public readonly roomID: number, public readonly user: User) {}
}
