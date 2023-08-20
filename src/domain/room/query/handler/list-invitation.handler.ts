import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListInvitationQuery } from '../list-invitation.query';
import {
    ListInvitationElement,
    ListInvitationResponse,
} from '../../presentation/dto/response';
import { InvitationRepository, RoomRepository } from '../../repository';
import {
    NoOwnerPermissionException,
    RoomNotFoundException,
} from '../../exception';

@QueryHandler(ListInvitationQuery)
export class ListInvitationHandler
    implements IQueryHandler<ListInvitationQuery>
{
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly invitationRepository: InvitationRepository,
    ) {}

    async execute(query: ListInvitationQuery): Promise<ListInvitationResponse> {
        const { roomID, user } = query;

        const room = await this.roomRepository
            .findOneByOrFail({ id: roomID })
            .catch(() => {
                throw new RoomNotFoundException(roomID);
            });

        if (room.ownerID != user.id) {
            throw new NoOwnerPermissionException();
        }

        const candidates = await this.invitationRepository.find({
            relations: { role: true },
            where: { room },
        });

        const invitations = candidates.map(
            (invitation): ListInvitationElement => ({
                expiresAt: invitation.expiresAt,
                token: invitation.token,
                role: { alias: invitation.role.alias },
            }),
        );

        return ListInvitationResponse.from(invitations);
    }
}
