import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteInvitationCommand } from '../delete-invitation.command';
import { InvitationRepository, RoomRepository } from '../../repository';
import {
    NoMatchingInvitationException,
    NoOwnerPermissionException,
    RoomNotFoundException,
} from '../../exception';

@CommandHandler(DeleteInvitationCommand)
export class DeleteInvitationHandler
    implements ICommandHandler<DeleteInvitationCommand>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly invitationRepository: InvitationRepository,
    ) {}

    async execute(command: DeleteInvitationCommand): Promise<void> {
        const { token, roomID, user } = command;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        const invitation = await this.invitationRepository
            .findOneByOrFail({
                token,
                room,
            })
            .catch(() => {
                throw new NoMatchingInvitationException(roomID, token);
            });

        if (room.ownerID != user.id) {
            throw new NoOwnerPermissionException();
        }

        await this.invitationRepository.delete(invitation);
    }
}
