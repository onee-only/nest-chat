import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRoleCommand } from '../create-role.command';
import { MemberRoleRepository, RoomRepository } from '../../repository';
import { PermissionChecker } from '../../util';
import { RoomPermission } from '../../enum';
import {
    DuplicateRoleAliasException,
    RoomNotFoundException,
} from '../../exception';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly memberRoleRepository: MemberRoleRepository,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(command: CreateRoleCommand): Promise<void> {
        const { alias, permission, roomID, user } = command;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        await this.permissionChecker.checkOrThrow({
            action: RoomPermission.MANAGE_ROLE,
            room: room,
            user: user,
        });

        const role = this.memberRoleRepository.create({
            alias,
            permission,
            room,
        });

        if (await this.memberRoleRepository.duplicateAliasExists(room, alias)) {
            throw new DuplicateRoleAliasException(roomID, alias);
        }

        await this.memberRoleRepository.save(role);
    }
}
