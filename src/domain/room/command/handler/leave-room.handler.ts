import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LeaveRoomCommand } from '../leave-room.command';
import { RoomMemberRepository, RoomRepository } from '../../repository';
import {
    LeavingAsOwnerException,
    NoMatchingMemberException,
    RoomNotFoundException,
} from '../../exception';

@CommandHandler(LeaveRoomCommand)
export class LeaveRoomHandler implements ICommandHandler<LeaveRoomCommand> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
    ) {}

    async execute(command: LeaveRoomCommand): Promise<void> {
        const { roomID, user } = command;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        const member = await this.roomMemberRepository
            .findOneByOrFail({ roomID, userID: user.id })
            .catch(() => {
                throw new NoMatchingMemberException(roomID, user.id);
            });

        if (room.ownerID === member.userID) {
            throw new LeavingAsOwnerException();
        }

        await this.roomMemberRepository.remove(member);
    }
}
