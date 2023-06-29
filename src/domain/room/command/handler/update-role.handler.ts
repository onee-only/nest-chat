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

    async execute(command: UpdateRoleCommand): Promise<any> {
        const { alias, permission, roomID, user, roleID } = command;

        const room = await this.roomRepository.findOneBy({ id: roomID });
        if (room == null) {
            throw new RoomNotFoundException(roomID);
        }

        await this.permissionChecker.checkAvailableOrThrow(
            room,
            user,
            RoomPermission.MANAGE_ROLE,
        );

        const role = await this.memberRoleRepository.findOneBy({ id: roleID });
        if (role == null) {
            throw new NoMatchingRoleException(roomID, roleID);
        }

        const candiate = this.objectManager.filterNullish({
            alias,
            permission,
        });
        Object.assign(role, candiate);

        if (await this.memberRoleRepository.duplicateAliasExists(room, alias)) {
            throw new DuplicateRoleAliasException(roomID, alias);
        }

        await this.memberRoleRepository.save(role);
    }
}
