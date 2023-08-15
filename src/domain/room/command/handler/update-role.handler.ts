import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRoleCommand } from '../update-role.command';
import { MemberRoleRepository, RoomRepository } from '../../repository';
import { PermissionChecker } from '../../util';
import { RoomPermission } from '../../enum';
import {
    DuplicateRoleAliasException,
    NoMatchingRoleException,
    RoomNotFoundException,
} from '../../exception';
import { ObjectManager } from 'src/global/modules/utils/object';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly memberRoleRepository: MemberRoleRepository,
        private readonly permissionChecker: PermissionChecker,
        private readonly objectManager: ObjectManager,
    ) {}

    async execute(command: UpdateRoleCommand): Promise<void> {
        const { alias, permission, roomID, user, newAlias } = command;

        const room = await this.roomRepository.findOneBy({ id: roomID });
        if (room == null) {
            throw new RoomNotFoundException(roomID);
        }

        await this.permissionChecker.checkOrThrow({
            action: RoomPermission.MANAGE_ROLE,
            room: room,
            user: user,
        });

        const role = await this.memberRoleRepository.findOneBy({ room, alias });
        if (role == null) {
            throw new NoMatchingRoleException(roomID, alias);
        }

        const candiate = this.objectManager.filterNullish({
            newAlias,
            permission,
        });
        Object.assign(role, candiate);

        if (
            await this.memberRoleRepository.duplicateAliasExists(room, newAlias)
        ) {
            throw new DuplicateRoleAliasException(roomID, newAlias);
        }

        await this.memberRoleRepository.save(role);
    }
}
