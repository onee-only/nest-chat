import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JoinRoomCommand } from '../join-room.command';
import {
    InvitationRepository,
    RoomMemberRepository,
    RoomRepository,
} from '../../repository';
import {
    AlreadyJoinedException,
    InvalidInvitationTokenException,
    MissingTokenException,
    RoomNotFoundException,
} from '../../exception';
import { MemberRole, Room } from '../../entity';
import { User } from 'src/domain/user/entity';

@CommandHandler(JoinRoomCommand)
export class JoinRoomHandler implements ICommandHandler<JoinRoomCommand> {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly invitationRepository: InvitationRepository,
    ) {}

    async execute(command: JoinRoomCommand): Promise<void> {
        const { roomID, user, token } = command;

        const room = await this.roomRepository
            .findOneOrFail({
                relations: { defaultRole: true },
                where: { id: roomID },
            })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        const exists = await this.roomMemberRepository.exist({
            where: { user, room },
        });
        if (exists) {
            throw new AlreadyJoinedException();
        }

        if (token == null) {
            if (!room.isPublic) {
                throw new MissingTokenException(roomID);
            }
            return await this.saveMember(user, room, room.defaultRole);
        }

        const invitation = await this.invitationRepository
            .findOneOrFail({
                relations: { role: true },
                where: { token, roomID },
            })
            .catch(() => {
                throw new InvalidInvitationTokenException(roomID, token);
            });

        return await this.saveMember(user, room, invitation.role);
    }

    private async saveMember(
        user: User,
        room: Room,
        role: MemberRole,
    ): Promise<void> {
        const member = this.roomMemberRepository.create({
            role,
            room,
            user,
        });

        await this.roomMemberRepository.save(member);
    }
}
