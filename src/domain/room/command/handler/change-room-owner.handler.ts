import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeRoomOwnerCommand } from '../change-room-owner.command';
import { RoomMemberRepository, RoomRepository } from '../../repository';
import {
    NoMatchingMemberException,
    NoOwnerPermissionException,
    RoomNotFoundException,
} from '../../exception';

@CommandHandler(ChangeRoomOwnerCommand)
export class ChangeRoomOwnerHandler
    implements ICommandHandler<ChangeRoomOwnerCommand>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
    ) {}

    async execute(command: ChangeRoomOwnerCommand): Promise<void> {
        const { memberID, roomID, user } = command;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        if (room.ownerID !== user.id) {
            throw new NoOwnerPermissionException();
        }

        const member = await this.roomMemberRepository
            .findOneByOrFail({ roomID, userID: memberID })
            .catch(() => {
                throw new NoMatchingMemberException(roomID, user.id);
            });

        await this.roomRepository.update(room.id, { ownerID: member.userID });
    }
}
