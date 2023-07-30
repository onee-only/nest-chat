import { CreateRoomHandler } from './create-room.handler';
import { DeleteRoomHandler } from './delete-room.handler';
import { UpdateRoomHandler } from './update-room.handler';
import { CreateRoleHandler } from './create-role.handler';
import { UpdateRoleHandler } from './update-role.handler';
import { DeleteRoleHandler } from './delete-role.handler';
import { CreateInvitationHandler } from './create-invitation.handler';
import { DeleteInvitationHandler } from './delete-invitation.handler';
import { JoinRoomHandler } from './join-room.handler';
import { KickMemberHandler } from './kick-member.handler';

export const CommandHandlers = [
    CreateRoomHandler,
    UpdateRoomHandler,
    DeleteRoomHandler,
    CreateRoleHandler,
    UpdateRoleHandler,
    DeleteRoleHandler,
    CreateInvitationHandler,
    DeleteInvitationHandler,
    JoinRoomHandler,
    KickMemberHandler,
];
