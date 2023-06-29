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
        const { roomID, user, roleID } = command;

        const room = await this.roomRepository.findOneBy({ id: roomID });
        if (room == null) {
            throw new RoomNotFoundException(roomID);
        }

        await this.permissionChecker.checkOrThrow({
            action: RoomPermission.MANAGE_ROLE,
            room: room,
            user: user,
        });

        const role = await this.memberRoleRepository.findOneBy({ id: roleID });
        if (role == null) {
            throw new NoMatchingRoleException(roomID, roleID);
        }

        if (await this.roomMemberRepository.existsByRoomAndRole(room, role)) {
            // throw
        }

        await this.memberRoleRepository.delete(role);
    }
}
