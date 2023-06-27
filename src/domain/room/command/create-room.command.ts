import { ICommand } from '@nestjs/cqrs';
import { User } from 'src/domain/user/entity';
import { PermissionDto } from '../presentation/dto/internal';

export class CreateRoomCommand implements ICommand {
    constructor(
        public readonly user: User,
        public readonly profileURL: string,
        public readonly name: string,
        public readonly description: string,
        public readonly isPublic: boolean,
        public readonly roleName: string,
        public readonly rolePermission: PermissionDto,
    ) {}
}
