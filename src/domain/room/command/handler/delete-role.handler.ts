import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
    MemberRoleRepository,
    RoomMemberRepository,
    RoomRepository,
} from '../../repository';
import { PermissionChecker } from '../../util';
import { RoomPermission } from '../../enum';
import {
    NoMatchingRoleException,
    RoleOccupiedException,
    RoomNotFoundException,
} from '../../exception';
import { DeleteRoleCommand } from '../delete-role.command';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly memberRoleRepository: MemberRoleRepository,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(command: DeleteRoleCommand): Promise<any> {
        const { roomID, user, alias } = command;

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
            .findOneByOrFail({ alias, roomID })
            .catch(() => {
                throw new NoMatchingRoleException(roomID, alias);
            });

        if (await this.roomMemberRepository.existsByRoomAndRole(room, role)) {
            throw new RoleOccupiedException();
        }

        await this.memberRoleRepository.delete(role);
    }
}
