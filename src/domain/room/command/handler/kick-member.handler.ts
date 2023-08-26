import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { KickMemberCommand } from '../kick-member.command';
import { RoomMemberRepository, RoomRepository } from '../../repository';
import {
    KickingOwnerException,
    KickingSelfException,
    NoMatchingMemberException,
    RoomNotFoundException,
} from '../../exception';
import { PermissionChecker } from '../../util';
import { RoomPermission } from '../../enum';

@CommandHandler(KickMemberCommand)
export class KickMemberHandler implements ICommandHandler<KickMemberCommand> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,

        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(command: KickMemberCommand): Promise<void> {
        const { roomID, memberID, user } = command;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        await this.permissionChecker.checkOrThrow({
            action: RoomPermission.KICK_MEMBER,
            room,
            user,
        });

        const member = await this.roomMemberRepository
            .findOneByOrFail({ roomID, userID: memberID })
            .catch(() => {
                throw new NoMatchingMemberException(roomID, memberID);
            });

        if (member.userID === user.id) {
            throw new KickingSelfException();
        }

        if (member.userID === room.ownerID) {
            throw new KickingOwnerException();
        }

        await this.roomMemberRepository.delete({
            userID: member.userID,
            roomID: member.roomID,
        });
    }
}
