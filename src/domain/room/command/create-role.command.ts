import { ICommand } from '@nestjs/cqrs';
import { PermissionDto } from '../presentation/dto/internal';
import { User } from 'src/domain/user/entity';

export class CreateRoleCommand implements ICommand {
    constructor(
        public readonly user: User,
        public readonly roomID: number,
        public readonly alias: string,
        public readonly permission: PermissionDto,
    ) {}
}
