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

        const role = await this.memberRoleRepository
            .findOneByOrFail({
                roomID: roomID,
                alias,
            })
            .catch(() => {
                throw new NoMatchingRoleException(roomID, alias);
            });

        const candiate = this.objectManager.filterNullish({
            alias: newAlias,
            permission,
        });

        const isDuplicate =
            await this.memberRoleRepository.duplicateAliasExists(
                room,
                newAlias,
            );
        if (isDuplicate) {
            throw new DuplicateRoleAliasException(roomID, newAlias);
        }

        await this.memberRoleRepository.update(
            { alias: role.alias, roomID: roomID },
            candiate,
        );
    }
}
