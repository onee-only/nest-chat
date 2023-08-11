import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';
import { Permission } from '../presentation/dto/internal';

type RoomInput = {
    readonly profileURL: string;
    readonly name: string;
    readonly description: string;
    readonly isPublic: boolean;
    readonly owner: User;
};

type RoleInput = {
    readonly roleName: string;
    readonly rolePermission: Permission;
};

export class CreateRoomCommand implements ICommand {
    constructor(
        public readonly roleInput: RoleInput,
        public readonly roomInput: RoomInput,
    ) {}
}
