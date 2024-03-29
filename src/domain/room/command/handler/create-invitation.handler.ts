import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateInvitationCommand } from '../create-invitation.command';
import { CreateInvitationResponse } from '../../presentation/dto/response';
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
import { v4 as generateUUID } from 'uuid';

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
    ): Promise<CreateInvitationResponse> {
        const { duration, alias, roomID, user } = command;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        const role = await this.memberRoleRepository
            .findOneByOrFail({ alias, roomID })
            .catch(() => {
                throw new NoMatchingRoleException(roomID, alias);
            });

        await this.permissionChecker.checkOrThrow({
            action: RoomPermission.INVITE_MEMBER,
            room: room,
            user: user,
        });

        const expiresAt = Date.now() + duration;

        const candiate = this.invitationRepository.create({
            token: generateUUID(),
            role: role,
            room: room,
            expiresAt: new Date(expiresAt),
        });
        const invitation = await this.invitationRepository.save(candiate);

        return CreateInvitationResponse.from(invitation);
    }
}
