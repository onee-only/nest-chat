import { ListInvitationHandler } from './list-invitation.handler';
import { ListMemberHandler } from './list-member.handler';
import { ListRoleHandler } from './list-role.handler';
import { ListRoomHandler } from './list-room.handler';
import { RetreiveRoomHandler } from './retreive-room.handler';

export const QueryHandlers = [
    ListRoleHandler,
    ListRoomHandler,
    ListMemberHandler,
    ListInvitationHandler,
    RetreiveRoomHandler,
];
