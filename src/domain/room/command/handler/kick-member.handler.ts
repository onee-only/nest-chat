import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { KickMemberCommand } from '../kick-member.command';
import { RoomMemberRepository, RoomRepository } from '../../repository';
import {
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
            .findOneByOrFail({ id: memberID })
            .catch(() => {
                throw new NoMatchingMemberException(roomID, memberID);
            });

        await this.roomMemberRepository.remove(member);
    }
}
