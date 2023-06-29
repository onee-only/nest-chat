import { CreateRoomHandler } from './create-room.handler';
import { DeleteRoomHandler } from './delete-room.handler';
import { UpdateRoomHandler } from './update-room.handler';
import { CreateRoleHandler } from './create-role.handler';
import { UpdateRoleHandler } from './update-role.handler';
import { DeleteRoleHandler } from './delete-role.handler';

export const CommandHandlers = [
    CreateRoomHandler,
    UpdateRoomHandler,
    DeleteRoomHandler,
    CreateRoleHandler,
    UpdateRoleHandler,
    DeleteRoleHandler,
];
