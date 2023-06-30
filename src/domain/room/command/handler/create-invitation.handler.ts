import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateInvitationCommand } from '../create-invitation.command';
import { CreateInvitationResponseDto } from '../../presentation/dto/response';
import {
    InvitationRepository,
    MemberRoleRepository,
    RoomRepository,
} from '../../repository';
import { PermissionChecker } from '../../util';
import { RoomPermission } from '../../enum';
import {
    NoMatchingRoleException,
    RoomNotFoundException,
} from '../../exception';

@CommandHandler(CreateInvitationCommand)
export class CreateInvitationHandler
    implements ICommandHandler<CreateInvitationCommand>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly memberRoleRepository: MemberRoleRepository,
        private readonly invitationRepository: InvitationRepository,
        private readonly permissionChecker: PermissionChecker,
    ) {}

    async execute(
        command: CreateInvitationCommand,
    ): Promise<CreateInvitationResponseDto> {
        const { duration, roleID, roomID, user } = command;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        const role = await this.memberRoleRepository
            .findOneByOrFail({ id: roleID })
            .catch(() => {
                throw new NoMatchingRoleException(roomID, roleID);
            });

        await this.permissionChecker.checkOrThrow({
            action: RoomPermission.INVITE_MEMBER,
            room: room,
            user: user,
        });

        const expiresAt = Date.now() + duration;

        const candiate = this.invitationRepository.create({
            role,
            room,
            expiresAt,
        });
        const invitation = await this.invitationRepository.save(candiate);

        return CreateInvitationResponseDto.from(invitation);
    }
}
