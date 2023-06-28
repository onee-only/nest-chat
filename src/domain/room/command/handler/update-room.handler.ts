import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRoomCommand } from '../update-room.command';
import { MemberRoleRepository, RoomRepository } from '../../repository';
import { MemberRole, Room } from '../../entity';
import {
    NoMatchingRoleException,
    NoOwnerPermissionException,
    RoomNotFoundException,
} from '../../exception';

@CommandHandler(UpdateRoomCommand)
export class UpdateRoomHandler implements ICommandHandler<UpdateRoomCommand> {
    constructor(
        private readonly roomRepsitory: RoomRepository,
        private readonly memberRoleRepository: MemberRoleRepository,
    ) {}

    async execute(command: UpdateRoomCommand): Promise<void> {
        const {
            data: { defaultRoleID },
        } = command;
        const { user, roomID, data } = command;

        const room = await this.roomRepsitory.findOneWithOwnerById(roomID);
        if (room == null) {
            throw new RoomNotFoundException(roomID);
        }

        if (room.owner != user) {
            throw new NoOwnerPermissionException();
        }

        if (defaultRoleID != null) {
            room.defaultRole = await this.getMemberRole(defaultRoleID, room);
            delete data.defaultRoleID;
        }

        await this.roomRepsitory.update(room, data);
    }

    private async getMemberRole(
        roleID: number,
        room: Room,
    ): Promise<MemberRole> {
        const role = await this.memberRoleRepository.findOneBy({
            room: room,
            id: roleID,
        });

        if (role == null) {
            throw new NoMatchingRoleException(room.id, roleID);
        }
        return role;
    }
}
